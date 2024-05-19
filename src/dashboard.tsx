import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelect } from "./hooks/useSelect";
import CardMarketButtons from "./cardMarketButtons";
import Networth from "./networth";
import "./dashboard.css";
import Graph from "./graph";

const scryfall_url = "https://api.scryfall.com/";

const cache = {};
function checkCache(id) {
  if (cache[id]) {
    return cache[id];
  }
  return false;
}

const Dashboard = () => {
  const [cardNameInput, setCardNameInput] = useState("");
  const [price, setPrice] = useState(0.0);

  const { selectedCard } = useSelect((state) => state);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch({ type: "logout" });
  };

  const sample = [
    {
      name: "Island",
      id: "1cb1ac28-ee04-4892-97ea-2cfdebbafcad",
      prices: { usd: 0.1 },
      image_uris: {
        normal:
          "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/c/1cb1ac28-ee04-4892-97ea-2cfdebbafcad.jpg?1562925073",
      },
    },
    {
      name: "Totally Lost",
      id: "05f0b6ce-eb70-4f42-9360-c7d09f48a5c5",
      prices: { usd: 0.1 },
      image_uris: {
        normal:
          "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/c/1cb1ac28-ee04-4892-97ea-2cfdebbafcad.jpg?1562925073",
      },
    },
    {
      name: "Impulse",
      id: "2e48fe92-a2d7-49a8-a05d-6f032c532f14",
      prices: { usd: 0.1 },
      image_uris: {
        normal:
          "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/c/1cb1ac28-ee04-4892-97ea-2cfdebbafcad.jpg?1562925073",
      },
    },
  ];

  useEffect(() => {
    if (selectedCard) {
      setPrice(getPrice(selectedCard));
    }
  }, [selectedCard]);

  function getCard() {
    fetch(scryfall_url + "cards/search?q=" + cardNameInput)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.object === "list") {
          let d = data.data;
          console.log(d);

          // setSelectedCard(d[0]);
          // setPrice(getPrice(d[0]));
        }
      });
  }

  function scryfall_get_by_id(id) {
    let card = checkCache(id);
    if (card) {
      return card;
    }
    fetch(scryfall_url + "cards/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch({ type: "selectCard", card: data });
        // setSelectedCard(data);
        // setPrice(getPrice(data));
      });
  }

  function scryfall_search_by_name(nameSearchInput) {
    fetch(scryfall_url + "cards/search?q=" + nameSearchInput)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.object === "list") {
          let d = data.data;
          console.log(d);
          // setSelectedCard(d[0]);
          // setPrice(getPrice(d[0]));
        }
      });
  }

  function randomCard() {
    fetch(scryfall_url + "cards/random")
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "selectCard", card: data });
        // console.log(data);
        // setSelectedCard(data);
        // setPrice(getPrice(data));
      });
  }

  const onPortEntryMouseLeave = (e) => {
    // setSelectedCard({});
  };

  return (
    <div className="main">
      <div className="header">
        Dashboard
        <div className="card-search">
          <input
            type="text"
            onChange={(e) => setCardNameInput(e.target.value)}
            placeholder="card name"
            value={cardNameInput}
          />
          <button onClick={() => getCard()}>search</button>
          <button onClick={() => randomCard()}>random</button>
          <button onClick={() => logout()}>logout</button>
        </div>
      </div>

      <div className="panels">
        <div className="left">
          <div className="networth">
            Value: <Networth />
          </div>
          Cash : $0.00
          <div>
            <div className="portCardList">Your Cards</div>
            {sample.map((card) => {
              return (
                <div
                  className="portCardEntry"
                  key={card.name}
                  onClick={() => {
                    const c = scryfall_get_by_id(card.id);
                    console.log("c", c);
                  }}
                >
                  {card.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="center">
          <div className="graph-container">
            Graph
            <Graph />
          </div>
          <div className="price-and-buttons">
            <div className="price">
              <h3>price{price}</h3>
            </div>
            <CardMarketButtons />
            You have X of this card
          </div>
        </div>
        <div className="right">
          <div className="card-display">
            {selectedCard && selectedCard.image_uris && (
              <img
                src={selectedCard.image_uris.normal}
                alt={selectedCard.name}
                width={"300px"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const getPrice = (card) => {
  if (card.prices.usd) {
    return card.prices.usd;
  }
  if (card.prices.usd_foil) {
    return card.prices.usd_foil;
  }
  if (card.prices.usd_etched) {
    return card.prices.usd_etched;
  }
  if (card.prices.eur) {
    return card.prices.eur;
  }
  if (card.prices.eur_foil) {
    return card.prices.eur_foil;
  }
  if (card.prices.tix) {
    return card.prices.tix;
  }
  return 0;
};
