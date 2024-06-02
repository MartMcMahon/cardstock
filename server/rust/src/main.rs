use anyhow::Result;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use tokio_postgres::NoTls;

#[derive(Deserialize, Serialize, Debug)]
pub struct AllPrices {
    pub meta: serde_json::Value,
    pub data: serde_json::Value,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct PriceFormats {
    pub mtgo: Option<Record<PriceList>>,
    pub paper: Option<PaperPriceList>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Record<T> {
    pub cardhoarder: Option<T>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct PriceList {
    pub buylist: Option<PricePoints>,
    pub currency: String,
    pub retail: Option<PricePoints>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct PricePoints {
    pub foil: Option<std::collections::HashMap<String, f64>>,
    pub normal: Option<std::collections::HashMap<String, f64>>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct PaperPriceList {
    pub cardkingdom: Option<PriceList>,
    pub cardmarket: Option<PriceList>,
    pub cardsphere: Option<PriceList>,
    pub tcgplayer: Option<PriceList>,
}
impl PaperPriceList {
    pub fn price_list(&self) -> Option<&PriceList> {
        if let Some(ref price_list) = self.cardkingdom {
            return Some(price_list);
        } else if let Some(ref price_list) = self.tcgplayer {
            return Some(price_list);
        } else if let Some(ref price_list) = self.cardmarket {
            return Some(price_list);
        } else if let Some(ref price_list) = self.cardsphere {
            return Some(price_list);
        }
        None
    }
}
#[derive(Deserialize, Serialize, Debug)]
enum Source {
    CardKingdom,
    CardMarket,
    CardSphere,
    TCGPlayer,
}
impl Source {
    pub fn to_string(&self) -> String {
        match self {
            Source::CardKingdom => "cardkingdom".to_string(),
            Source::CardMarket => "cardmarket".to_string(),
            Source::CardSphere => "cardsphere".to_string(),
            Source::TCGPlayer => "tcgplayer".to_string(),
        }
    }
}

async fn read_json(file_path: &str) -> serde_json::Result<AllPrices> {
    let mut file = File::open(file_path).await.unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).await.unwrap();
    let data: AllPrices = serde_json::from_str(&contents)?;
    Ok(data)
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let db_user = std::env::var("DB_USER").expect("DB_USER must be set. Check your .env file");
    let db_password =
        std::env::var("DB_PASSWORD").expect("DB_PASSWORD must be set. Check your .env file");

    println!("loading data from AllPrices.json");
    let file_path = "AllPrices.json";
    let all_prices = read_json(file_path).await?;
    let data = all_prices.data;
    let obj = data.as_object().unwrap();
    println!("key count: {}", obj.keys().len());

    let client = init_tables(db_user, db_password).await?;

    for (mtg_json_id, value) in obj {
        println!("key: {}", mtg_json_id);
        let price_formats: PriceFormats = serde_json::from_value(value.clone())?;
        if price_formats.paper.is_none() {
            continue;
        }
        let paper = price_formats.paper.unwrap();
        // TODO: only care about cardkingdom + normal for now
        if paper.cardkingdom.is_none() {
            continue;
        }
        let source = Source::CardKingdom;
        let cardkingdom = paper.cardkingdom.unwrap();
        if cardkingdom.retail.is_none() {
            continue;
        }
        let retail = cardkingdom.retail.unwrap();
        if retail.normal.is_none() {
            continue;
        }
        let normal = retail.normal.unwrap();
        // let _foil = retail.foil.unwrap();

        println!("normal");
        for (date_string, price) in normal {
            let date = chrono::NaiveDate::parse_from_str(&date_string, "%Y-%m-%d")?;
            let datetime = date.and_hms_opt(0, 0, 0).unwrap();
            let res = client
                .execute(
                    "INSERT INTO price_history (mtg_json_id, timestamp, price, source) VALUES ($1, $2, $3, $4)
                     ON CONFLICT (unique_card_date) DO NOTHING",
                     &[&mtg_json_id, &datetime, &price, &source.to_string()],
                )
                .await;
            match res {
                Ok(_) => print!("inserted"),
                Err(e) => println!("error: {}", e),
            }
        }
    }

    Ok(())
}

async fn init_tables(db_user: String, db_password: String) -> Result<tokio_postgres::Client> {
    let (client, connection) = tokio_postgres::connect(
        format!(
            "host=localhost user={} password={} dbname=cardstock",
            db_user, db_password
        )
        .as_str(),
        NoTls,
    )
    .await?;

    // Spawn the connection to run in the background
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    client
        .batch_execute(
            "CREATE TABLE IF NOT EXISTS price_history (
                    id SERIAL PRIMARY KEY,
                    mtg_json_id TEXT NOT NULL,
                    timestamp TIMESTAMP NOT NULL,
                    price DOUBLE PRECISION NOT NULL,
                    CONSTRAINT unique_card_date UNIQUE (mtg_json_id, timestamp));

                    CREATE INDEX IF NOT EXISTS idx_mtg_json_id_timestamp ON price_history (mtg_json_id, timestamp);",
        )
        .await?;

    return Ok(client);
}
