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
  const {
    cardPositions,
    cardData,
    cash,
    mouseCard,
    mousePos,
    selectedCard,
    simple_price,
  } = useSelect((state) => state.main);
  const dispatch = useDispatch<Dispatch>();

  const logout = () => {
    dispatch({ type: "logout" });
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
                    onMouseMove={(e) => {
                      dispatch(
                        mainActions.mouseCard({
                          card,
                          pos: [e.clientX, e.clientY],
                        })
                      );
                    }}
                    onMouseLeave={() => {
                      dispatch(mainActions.mouseLeaveCard(card));
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
              <div className="price-and-buttons">
                <h2>{selectedCard.name}</h2>
                <div className="price">
                  <h3>{simple_price}</h3>
                  <CardMarketButtons />
                  You have {cardPositions[selectedCard.id] || 0} of this card
                </div>
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
      <div
        style={{
          position: "absolute",
          left: mousePos[0],
          top: mousePos[1],
          pointerEvents: "none",
        }}
      >
        {mouseCard && mouseCard.image_uris && (
          <img
            src={mouseCard.image_uris.normal}
            alt={mouseCard.name}
            width={"100px"}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
