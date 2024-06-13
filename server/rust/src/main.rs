use csv::Writer;
use mtgjson::{CardSet, Set};
use std::error::Error;
use std::fs::metadata;
use tokio::fs::File;
use tokio::io::AsyncReadExt;

mod mtgjson;

async fn read_json(file_path: &str) -> serde_json::Result<Vec<CardSet>> {
    let mut file = File::open(file_path).await.unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).await.unwrap();
    let all_printings_value: serde_json::Value = serde_json::from_str(&contents)?;
    let data = all_printings_value.get("data").unwrap();
    let mut full_card_list: Vec<CardSet> = Vec::new();

    data.as_object()
        .unwrap()
        .iter()
        .for_each(|(set_code, data)| {
            let data: Result<Set, serde_json::Error> = serde_json::from_value(data.clone());
            match data {
                Ok(data) => {
                    data.cards.iter().for_each(|card| {
                        full_card_list.push(card.clone());
                    });
                }
                Err(e) => {
                    println!("Error: {}", e);
                    // println!("the data is {:#?}", data);
                }
            }
        });

    Ok(full_card_list)
}

fn write_to_csv(cards: Vec<CardSet>, csv_file_path: &str) -> Result<(), Box<dyn Error>> {
    let mut wtr = Writer::from_path(csv_file_path)?;

    for card in cards {
        let scryfall_id = match card.identifiers.scryfall_id.clone() {
            Some(scryfall_id) => scryfall_id,
            None => "".to_string(),
        };
        let colorstr = &card.colors.join("");

        wtr.write_record(&["uuid", "scryfall_id", "name", "colors", "set_code"])?;
        wtr.write_record(&[
            &card.uuid,
            &scryfall_id,
            &card.name,
            colorstr,
            &card.set_code,
        ])?;
    }

    wtr.flush()?;
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let json_file = "AllPrintings.json";
    let csv_file = "printings.csv";
    let cards = read_json(json_file).await?;

    write_to_csv(cards, csv_file)?;

    let metadata = metadata(csv_file)?;
    println!(
        "The size of '{}' is now {} bytes.",
        csv_file,
        metadata.len()
    );
    Ok(())
}
