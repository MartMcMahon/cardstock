import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardMarketButtons from "./cardMarketButtons";
import NetWorth from "./networth";
import "./dashboard.css";

let scryfall_url = "https://api.scryfall.com/";

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

  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch({ type: "logout" });
  };

  const sample = [
    { name: "Island", id: "1cb1ac28-ee04-4892-97ea-2cfdebbafcad" },
    { name: "Totally Lost", id: "05f0b6ce-eb70-4f42-9360-c7d09f48a5c5" },
    { name: "Impulse", id: "2e48fe92-a2d7-49a8-a05d-6f032c532f14" },
  ];

  useEffect(() => {
    if (state.selectedCard) {
      setPrice(getPrice(state.selectedCard));
    }
  }, [state.selectedCard]);

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

  function scryfall_get_id(id) {
    let card = checkCache(id);
    if (card) {
      return card;
    }
    fetch(scryfall_url + "cards/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
      <div className="left">
        Dashboard
        <NetWorth />
        <div>
          <div className="portCardList">Your Cards</div>
          {sample.map((card) => {
            return (
              <div
                className="portCardEntry"
                key={card.name}
                onMouseEnter={(e) => {
                  scryfall_get_id(card.id);
                }}
              >
                {card.name}
              </div>
            );
          })}
          <button onClick={logout}>logout</button>
        </div>
      </div>
      <div className="center">
        <div className="card-search">
          <input
            type="text"
            onChange={(e) => setCardNameInput(e.target.value)}
            placeholder="card name"
            value={cardNameInput}
          />
          <button onClick={getCard}>search</button>
          <button onClick={randomCard}>random</button>
        </div>
        <div className="card-display">
          <div className="price">
            <h3>{price}</h3>
          </div>
        </div>
        <CardMarketButtons />
      </div>
      <div className="right">
        {state.selectedCard && state.selectedCard.image_uris && (
          <img
            src={state.selectedCard.image_uris.normal}
            alt={state.selectedCard.name}
            width={"300px"}
          />
        )}
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
