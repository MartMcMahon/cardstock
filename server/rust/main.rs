use futures::{StreamExt, TryStreamExt};
use mtgjson::{CardSet, Set};
use serde_json::Deserializer;
use std::error::Error;
use tokio::fs::File;
use tokio::io::{AsyncReadExt, BufReader};
use tokio_util::io::ReaderStream;

mod mtgjson;

async fn parse_json(file_path: &str) -> serde_json::Result<()> {
    let file = File::open(file_path).await.unwrap();
    let reader = BufReader::new(file);
    let mut stream = ReaderStream::new(reader);

    let mut buffer = Vec::new();
    while let Some(chunk) = stream.next().await {
        match chunk {
            Ok(bytes) => buffer.extend_from_slice(&bytes),
            Err(e) => eprintln!("Error reading file: {}", e),
        }
    }

    let json_value: serde_json::Value = serde_json::from_slice(&buffer)?;
    if let Some(data) = json_value.get("data").and_then(|v| v.as_object()) {
        for (set_code, data) in data.iter() {
            match serde_json::from_value::<Set>(data.clone()) {
                Ok(set) => {
                    for card in set.cards {
                        write_to_db(card).await;
                    }
                }
                Err(e) => {
                    println!("Error parsing set {}: {}", set_code, e);
                }
            }
        }
    }

    Ok(())
}

async fn write_to_db(card: CardSet) {
    // TODO: fill this in
    println!("card data: {:#?}", card);
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let json_file = "AllPrintings.json";
    // let cards = read_json(json_file).await?;

    parse_json(json_file).await?;

    // write_to_csv(cards, csv_file)?;

    // let metadata = metadata(csv_file)?;
    // println!(
    //     "The size of '{}' is now {} bytes.",
    //     csv_file,
    //     metadata.len()
    // );
    Ok(())
}
