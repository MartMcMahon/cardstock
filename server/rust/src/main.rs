use redis::AsyncCommands;
use serde::Deserialize;
use serde_json::Value;
use std::fs::File;
use std::io::{self, BufReader};
use tokio::runtime::Runtime;

#[derive(Deserialize)]
pub struct PriceFormats {
    pub mtgo: Option<Record<PriceList>>,
    pub paper: Option<PaperPriceList>,
}

#[derive(Deserialize)]
pub struct Record<T> {
    pub cardhoarder: Option<T>,
}

#[derive(Deserialize)]
pub struct PaperPriceList {
    pub cardkingdom: Option<PriceList>,
    pub cardmarket: Option<PriceList>,
    pub cardsphere: Option<PriceList>,
    pub tcgplayer: Option<PriceList>,
}

#[derive(Deserialize)]
pub struct PriceList {
    pub buylist: Option<PricePoints>,
    pub currency: String,
    pub retail: Option<PricePoints>,
}

#[derive(Deserialize)]
pub struct PricePoints {
    pub foil: Option<std::collections::HashMap<String, f64>>,
    pub normal: Option<std::collections::HashMap<String, f64>>,
}

async fn load_json_to_redis(file_path: &str, redis_url: &str) -> redis::RedisResult<()> {
    let client = redis::Client::open(redis_url)?;
    let mut con = client.get_async_connection().await?;
    println!("Connected to Redis");

    let file = File::open(file_path)?;
    let reader = BufReader::new(file);
    println!("Opened JSON file");
    println!("Reading JSON file..");
    let json_data: Value = serde_json::from_reader(reader).unwrap();
    println!("Read JSON file");

    // Process and insert data into Redis
    match json_data {
        Value::Object(map) => {
            for (key, value) in map {
                let key = key.as_str();
                let value = serde_json::to_string(&value).unwrap();
                con.set(key, value).await?;
            }
        }
        _ => println!("Expected JSON object at root"),
    }

    Ok(())
}

fn main() -> io::Result<()> {
    let rt = Runtime::new().unwrap();
    rt.block_on(load_json_to_redis("AllPrices.json", "redis://127.0.0.1/"))
        .unwrap();
    Ok(())
}
