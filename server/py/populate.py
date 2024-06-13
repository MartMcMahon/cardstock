#!/usr/bin/python3
import csv
import json
import sys


if len(sys.argv) == 1:
    print("Usage: main.py <printings | price_history>")
    print(
        '"populate.py printings" to convert AllPrintings.json to printings.csv for `cards` table.'
    )
    print(
        '"populate.py price_history" to convert AllPrices.json to price_history.csv for `price_history` table.'
    )
    sys.exit(1)

if sys.argv[1] not in ["printings", "price_history"]:
    print("Invalid argument. Please use 'printings' or 'price_history'.")
    sys.exit(1)

PRINTINGS_JSON_FILE_PATH = "AllPrintings.json"
PRINTINGS_CSV_FILE_PATH = "printings.csv"
PRICE_HISTORY_JSON_FILE_PATH = "AllPrices.json"
PRICE_HISTORY_CSV_FILE_PATH = "price_history.csv"

if sys.argv[1] == "printings":
    convert_printings()
elif sys.argv[1] == "price_history":
    convert_price_history()
sys.exit(0)


def convert_printings():
    with open(PRINTINGS_JSON_FILE_PATH, "r") as json_file:
        json_data = json.load(json_file)
        data = json_data.get("data")
        full_card_list = []
        for set_code in data:
            full_card_list += data[set_code]["cards"]

    with open(PRINTINGS_CSV_FILE_PATH, "w", newline="") as csv_file:
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


def convert_price_history():
    with open(PRICE_HISTORY_JSON_FILE_PATH, "r") as json_file:
        json_data = json.load(json_file)
        # data = json_data.get("data")
        # full_price_list = []
        # for card in data:
        #     full_price_list += data[card]["prices"]

    # with open(csv_file_path, "w", newline="") as csv_file:
    # csv_writer = csv.writer(csv_file)

    # csv_writer.writerow(["scryfall_id", "date", "price"])

    # for price in full_price_list:
    #     scryfall_id = price.get("scryfallId", "")
    #     date = price.get("date", "")
    #     price = price.get("price", "")

    #     csv_writer.writerow([scryfall_id, date, price])

    # print(f"Data successfully written to {csv_file_path}")
