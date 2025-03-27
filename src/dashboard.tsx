import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { debounce } from "lodash";
import { useSelect } from "./hooks/useSelect";
import CardMarketButtons from "./cardMarketButtons";
import CardNameLink from "./cardNameLink";
import Graph from "./graph";
import Loading from "./loading";

import { Dispatch } from "./store";
import { fetchCardById, fetchRandomCard, searchByName } from "./scryfall";
import { clearSearchResults } from "./scryfall_reducer";

import { Card } from "./types/card";
import { Tx } from "./types/market";
import { CardPosition } from "./types/user";

import "./dashboard.css";
import { fetchFailed } from "./api_reducer";
import PortfolioCardList from "./portfolioCardList";

const Dashboard = () => {
  const {
    cardData,
    mouseCard,
    mousePos,
    selectedCard,
    // selectedCardIsLoading,
    simple_price,
  } = useSelect((state) => state.main);
  const {
    cash,
    isLoading: userIsLoading,
    txData,
    cardPositions,
  } = useSelect((state) => state.user);
  const { isLoading: scryfallIsLoading, searchResults } = useSelect(
    (state) => state.scryfall
  );
  const dispatch = useDispatch<Dispatch>();

  const [cardNameInput, setCardNameInput] = useState("");
  const [searchResultsPos, setSearchResultsPos] = useState({ top: 0, left: 0 });
  const [searchResultsChunk, setSearchResultsChunk] = useState([]);
  const [networth, setNetWorth] = useState(0);
  const [selectedCardAmount, setSelectedCardAmount] = useState(0);

  const cardSearchRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  //   useEffect(() => {
  //     const cardPositions: { [key: string]: CardPosition } = {};
  //     let nw = 1000;
  //     txData.forEach((tx: Tx) => {
  //       if (tx.uuid in cardPositions) {
  //         const prevAmount = cardPositions[tx.uuid].amount;
  //         const prevCost = cardPositions[tx.uuid].cost;
  //         cardPositions[tx.uuid] = {
  //           uuid: tx.uuid,
  //           amount: prevAmount + tx.amount,
  //           cost: prevCost + tx.cost,
  //         };
  //       } else {
  //         cardPositions[tx.uuid] = tx;
  //       }
  //       nw -= tx.cost;
  //     });
  //     setCardPositions(cardPositions);
  //     setNetWorth(nw);
  //   }, [txData]);

  // useEffect(() => {
  //   const getPrice = async (uuid: string) => {
  //     const res = await fetch("http://localhost:3000/card/" + uuid);
  //     if (!res.ok) {
  //       dispatch(
  //         fetchFailed(`failed to get current price user data for ${uuid}`)
  //       );
  //     }
  //     const card = await res.json();

  //     console.log("dashboard, get current price", card);
  //   };

  //   Object.entries(cardPositions).forEach(
  //     ([uuid, pos]: [string, CardPosition]) => {
  //       let p = getPrice(uuid);
  //     }
  //   );
  // }, [cardPositions, dispatch]);

  // useEffect(() => {
  //   if (selectedCard && selectedCard.id in cardPositions) {
  //     setSelectedCardAmount(cardPositions[selectedCard.id].amount);
  //   } else {
  //     setSelectedCardAmount(0);
  //   }
  // }, [cardPositions, selectedCard]);

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
    if (scryfallIsLoading) {
      return <Loading />;
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

  if (userIsLoading) {
    return <Loading />;
  }

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
              onBlur={() => {
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
                  return (
                    <CardNameLink card={c} isSearchResults={true} amount={0} />
                  );
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
          <div className="networth">Value: {networth.toFixed(2)}</div>
          Cash : ${cash.toFixed(2)}
          <div>
            <PortfolioCardList />
          </div>
        </div>
        <div className="center">
          {selectedCard && (
            <>
              <div className="name">
                {scryfallIsLoading ? <Loading /> : <h2>{selectedCard.name}</h2>}
              </div>
              <div className="graph-container">
                {scryfallIsLoading ? <Loading /> : <Graph />}
              </div>
              <div className="price">
                <h3>{simple_price}</h3>
              </div>
              <CardMarketButtons />
              <div className="quantity-text">
                You have{" "}
                {(cardPositions[selectedCard.id] &&
                  cardPositions[selectedCard.id].amount) ||
                  0}{" "}
                of this card
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
