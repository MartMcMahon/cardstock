import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelect } from "./hooks/useSelect";
import CardMarketButtons from "./cardMarketButtons";
import Networth from "./networth";
import Graph from "./graph";
import { Dispatch } from "./store";

import { fetchCardById, fetchRandomCard } from "./scryfall";
import { mainActions } from "./main_reducer";

import "./dashboard.css";

const Dashboard = () => {
  const [cardNameInput, setCardNameInput] = useState("");
  const { cardPositions, cardData, cash, selectedCard, simple_price } =
    useSelect((state) => state.main);
  const dispatch = useDispatch<Dispatch>();

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

  // const onPortEntryMouseLeave = (e) => {
  //   // setSelectedCard({});
  // };

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
          <button onClick={() => console.log("search")}>search</button>
          <button
            onClick={() => {
              console.log("rando");
              dispatch(fetchRandomCard());
            }}
          >
            random
          </button>
          <button onClick={() => logout()}>logout</button>
        </div>
      </div>

      <div className="panels">
        <div className="left">
          <div className="networth">
            Value: <Networth />
          </div>
          Cash : ${cash.toFixed(2)}
          <div>
            <div className="portfolioCardList">Your Cards</div>
            {Object.entries(cardPositions as { [key: string]: number }).map(
              ([id, amount]: [string, number]) => {
                let card;
                if (id in cardData) {
                  card = cardData[id];
                } else {
                  dispatch(fetchCardById(id));
                  card = cardData[id];
                  console.log("card", card);
                }
                if (!card) {
                  return <div className="portfolioCardEntry"> ??error??</div>;
                }

                return (
                  <div
                    className="portfolioCardEntry"
                    key={id}
                    onClick={() => {
                      dispatch(mainActions.selectCard(card));
                    }}
                  >
                    {card.name} {amount !== 0 && `: ${amount}`}
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="center">
          <div className="graph-container">
            <Graph />
          </div>
          {selectedCard && (
            <>
              <h2>{selectedCard.name}</h2>
              <div className="price-and-buttons">
                <div className="price">
                  <h3>{simple_price}</h3>
                </div>
                <CardMarketButtons />
                You have {cardPositions[selectedCard.id] || 0} of this card
              </div>
            </>
          )}
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
