import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { useSelect } from "./hooks/useSelect";
import CardMarketButtons from "./cardMarketButtons";
import CardNameLink from "./cardNameLink";
import Graph from "./graph";
import Networth from "./networth";
import { Dispatch } from "./store";
import { fetchCardById, fetchRandomCard, searchByName } from "./scryfall";
import { clearSearchResults } from "./scryfall_reducer";
import { Card } from "./types/card";
import "./dashboard.css";

const Dashboard = () => {
  const {
    cardPositions,
    cash,
    cardData,
    mouseCard,
    mousePos,
    selectedCard,
    selectedCardIsLoading,
    simple_price,
  } = useSelect((state) => state.main);
  const { isLoading, searchResults } = useSelect((state) => state.scryfall);
  const dispatch = useDispatch<Dispatch>();
  const [cardNameInput, setCardNameInput] = useState("");
  const [searchResultsPos, setSearchResultsPos] = useState({ top: 0, left: 0 });
  const [searchResultsChunk, setSearchResultsChunk] = useState([]);
  const cardSearchRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    dispatch({ type: "logout" });
  };

  useEffect(() => {
    const updatePositon = () => {
      if (cardSearchRef && cardSearchRef.current) {
        const rect = cardSearchRef.current.getBoundingClientRect();
        setSearchResultsPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    };
    updatePositon();
    window.addEventListener("resize", updatePositon);
    return () => {
      window.removeEventListener("resize", updatePositon);
    };
  }, [setSearchResultsPos]);

  useEffect(() => {
    if (searchResults) {
      setSearchResultsChunk(searchResults.data.slice(0, 10));
    }
  }, [searchResults]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const debouncedNameSearch = debounce(() => {
      dispatch(searchByName(e.target.value));
    }, 150);

    setCardNameInput(e.target.value);
    debouncedNameSearch();
  };

  const cardImg = () => {
    if (isLoading) {
      return <div>loading...</div>;
    }
    if (selectedCard && selectedCard.image_uris) {
      return (
        <img
          src={selectedCard.image_uris.normal}
          alt={selectedCard.name}
          width={"300px"}
        />
      );
    }
  };

  return (
    <div className="main">
      <div className="header">
        Dashboard
        <div className="card-search">
          <div className="search-input" ref={cardSearchRef}>
            <input
              type="text"
              onChange={handleSearch}
              onFocus={handleSearch}
              onBlur={(e) => {
                dispatch(clearSearchResults());
              }}
              placeholder="card name"
              value={cardNameInput}
            />
            {cardSearchRef && cardSearchRef.current && searchResults && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 10,
                  ...searchResultsPos,
                }}
              >
                {searchResultsChunk.map((c: Card) => {
                  return <CardNameLink card={c} isSearchResults={true} />;
                })}
              </div>
            )}
          </div>
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
            <div className="portfolioCardList">
              Your Cards
              {Object.entries(cardPositions as { [key: string]: number }).map(
                ([id, amount]: [string, number]) => {
                  let card: Card;
                  if (id in cardData) {
                    card = cardData[id];
                  } else {
                    dispatch(fetchCardById(id));
                    card = cardData[id];
                  }

                  return (
                    <div className="portfolioCardEntry">
                      <CardNameLink card={card} isSearchResults={false} />
                      <div>{amount !== 0 && `: ${amount}`}</div>
                    </div>
                  );
                }
              )}
            </div>
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
          <div className="card-display">{cardImg()}</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: mousePos[0],
          top: mousePos[1],
          pointerEvents: "none",
          zIndex: 50,
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
