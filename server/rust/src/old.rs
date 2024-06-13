use anyhow::Result;
use csv::Writer;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::metadata;
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

fn get_price_list(val: &serde_json::Value) -> Option<HashMap<String, f64>> {
    let price_formats: PriceFormats = serde_json::from_value(val.clone()).unwrap();
    if price_formats.paper.is_none() {
        return None;
    }
    let paper = price_formats.paper.unwrap();
    // TODO: only care about cardkingdom + normal for now
    if paper.cardkingdom.is_none() {
        return None;
    }
    let source = Source::CardKingdom;
    let cardkingdom = paper.cardkingdom.unwrap();
    if cardkingdom.retail.is_none() {
        return None;
    }
    let retail = cardkingdom.retail.unwrap();
    if retail.normal.is_none() {
        return None;
    }
    let normal = retail.normal.unwrap();

    Some(normal)
}

async fn convert_price_history(prices: serde_json::Value) -> Result<()> {
    let obj = prices.as_object().unwrap();
    println!("key count: {}", obj.keys().len());

    // Open the output CSV file
    let output_path = "price_history.csv";
    let output_file = std::fs::File::create(output_path)?;
    let mut writer = Writer::from_writer(output_file);

    for (uuid, value) in obj {
        println!("key: {}", uuid);
        let price_list = get_price_list(value);

        let _price_list = match price_list {
            Some(price_list) => {
                for (date_string, price) in price_list {
                    let date = chrono::NaiveDate::parse_from_str(&date_string, "%Y-%m-%d")?;
                    let datetime = date.and_hms_opt(0, 0, 0).unwrap();
                    let datetime_str = datetime.to_string();
                    let price_str = price.to_string();
                    let record = vec![uuid, &datetime_str, &price_str, "cardkingdom"];
                    let _ = writer.write_record(record);
                }
            }
            None => {
                continue;
            }
        };
    }

    let _ = writer.flush();

    Ok(())
}

fn colors_to_str(colors: serde_json::Value) -> String {
    let mut color_str = String::new();
    for color in colors.as_array().unwrap() {
        let color = color.as_str().unwrap();
        println!("color: {}", color);
        match color {
            "white" => {
                color_str.push_str("W");
            }
            _ => {
                // color_str.push_str("");
            }
        }
    }
    color_str
}

#[allow(non_snake_case)]
#[derive(Deserialize, Serialize, Debug)]
struct Identifiers {
    cardKingdomEtchedId: Option<String>,
    cardKingdomFoilId: Option<String>,
    cardKingdomId: Option<String>,
    cardsphereId: Option<String>,
    cardsphereFoilId: Option<String>,
    mcmId: Option<String>,
    mcmMetaId: Option<String>,
    mtgArenaId: Option<String>,
    mtgjsonFoilVersionId: Option<String>,
    mtgjsonNonFoilVersionId: Option<String>,
    mtgjsonV4Id: Option<String>,
    mtgoFoilId: Option<String>,
    mtgoId: Option<String>,
    multiverseId: Option<String>,
    scryfallId: Option<String>,
    scryfallCardBackId: Option<String>,
    scryfallOracleId: Option<String>,
    scryfallIllustrationId: Option<String>,
    tcgplayerProductId: Option<String>,
    tcgplayerEtchedProductId: Option<String>,
}

fn pull_scryfall_id(value: &serde_json::Value) -> String {
    println!("value: {:?}", value);
    let identifiers: Identifiers = match serde_json::from_value(value["identifiers"].clone()) {
        Ok(identifiers) => identifiers,
        Err(e) => {
            println!("error: {}", e);
            return "".to_string();
        }
    };
    println!("identifiers: {:?}", identifiers);
    match identifiers.scryfallId {
        Some(scryfall_id) => scryfall_id,
        None => "".to_string(),
    }
}

async fn write_printings(printings: serde_json::Value) -> Result<()> {
    let obj = printings.as_object().unwrap();
    println!("key count: {}", obj.keys().len());

    let output_path = "printings.csv";
    let output_file = std::fs::File::create(output_path)?;
    let mut writer = Writer::from_writer(output_file);

    for (uuid, value) in obj {
        println!("key: {}", uuid);
        println!("{}", value["identifiers"]);
        let scryfall_id = pull_scryfall_id(value);
        let name = value["name"].as_str().unwrap().to_owned();
        let color = colors_to_str(value["colors"].clone());
        let set_code = value["setCode"].as_str().unwrap().to_owned();

        let record = vec![&uuid, &scryfall_id, &name, &color, &set_code];
        let _ = writer.write_record(record);
    }

    let _ = writer.flush();
    let metadata = metadata(output_path)?;
    println!("The size of '{}' is {} bytes.", output_path, metadata.len());

    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let db_host = std::env::var("DB_HOST").expect("DB_HOST must be set. Check your .env file");
    let db_user = std::env::var("DB_USER").expect("DB_USER must be set. Check your .env file");
    let db_password =
        std::env::var("DB_PASSWORD").expect("DB_PASSWORD must be set. Check your .env file");

    println!("establishing connnection to {}", db_host);
    let client = client(db_host, db_user, db_password).await?;
    // let _ph_table_res = init_price_history_table(&client).await?;

    // println!("loading data from AllPrices.json");
    // let file_path = "AllPrices.json";
    // let all_prices = read_json(file_path).await?;
    // let data = all_prices.data;
    // let _ = convert_price_history(data).await;

    println!("loading all printing data");
    let file_path = "AllPrintings.json";
    let all_printings = read_json(file_path).await?;
    let data = all_printings.data;
    let _ = write_printings(data).await;

    return Ok(());
}

async fn client(
    db_host: String,
    db_user: String,
    db_password: String,
) -> Result<tokio_postgres::Client> {
    let (client, connection) = tokio_postgres::connect(
        format!(
            "host={} user={} password={} dbname=cardstock",
            db_host, db_user, db_password
        )
        .as_str(),
        NoTls,
    )
    .await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });
    Ok(client)
}

async fn init_price_history_table(
    client: &tokio_postgres::Client,
) -> Result<&tokio_postgres::Client> {
    // Spawn the connection to run in the background

    client
        .batch_execute(
            "CREATE TABLE IF NOT EXISTS price_history (
                    id SERIAL PRIMARY KEY,
                    uuid TEXT NOT NULL,
                    timestamp TIMESTAMP NOT NULL,
                    price DOUBLE PRECISION NOT NULL,
                    source TEXT NOT NULL,
                    CONSTRAINT unique_card_date UNIQUE (uuid, timestamp, source));

                    CREATE INDEX IF NOT EXISTS idx_uuid_timestamp ON price_history (uuid, timestamp, source);",
        )
        .await?;

    return Ok(client);
}
