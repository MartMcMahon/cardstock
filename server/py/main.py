import json
import csv

json_file_path = "AllPrintings.json"
csv_file_path = "printings.csv"

with open(json_file_path, "r") as json_file:
    json_data = json.load(json_file)
    data = json_data.get("data")
    full_card_list = []
    for set_code in data:
        full_card_list += data[set_code]["cards"]


with open(csv_file_path, "w", newline="") as csv_file:
    csv_writer = csv.writer(csv_file)

    csv_writer.writerow(["uuid", "scryfall_id", "name", "color", "set_code"])

    for card in full_card_list:
        identifiers = card.get("identifiers")
        if identifiers is None:
            print(f"No identifiers found for card {card.get('name')}")
        scryfall_id = identifiers.get("scryfallId")
        if scryfall_id is None:
            print(f"No scryfall_id found for card {card.get('name')}")

        uuid = card.get("uuid", "")
        name = card.get("name", "")
        color_str = "".join(card.get("colors", []))
        set_code = card.get("setCode", "")

        csv_writer.writerow([uuid, scryfall_id, name, color_str, set_code])

print(f"Data successfully written to {csv_file_path}")
