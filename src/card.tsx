import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
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

const isCardId = (id: string): boolean => {
  // Regular expression to validate UUID (version 1 to 5)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const CardFocus = () => {
  const { focusedCard, simple_price } = useSelect(
    (state) => state.main
  );
  const { cash, cardPositions } = useSelect((state) => state.user);

  const { isLoading, searchResults } = useSelect((state) => state.scryfall);
  const dispatch = useDispatch<Dispatch>();
  const [cardNameInput, setCardNameInput] = useState("");
  const [searchResultsPos, setSearchResultsPos] = useState({ top: 0, left: 0 });
  const [searchResultsChunk, setSearchResultsChunk] = useState([]);
  const cardSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card_id = window.location.href.split("/").pop();
    if (card_id && isCardId(card_id)) {
      console.log("id from url", card_id);
    }
  }, []);

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
    if (focusedCard && focusedCard.image_uris) {
      return (
        <img
          src={focusedCard.image_uris.normal}
          alt={focusedCard.name}
          width={"300px"}
        />
      );
    }
  };

  return (
    <div className="main">
      <div className="header">
        Card
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
                    <CardNameLink
                      card={c}
                      isSearchResults={true}
                      amount={null}
                    />
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
        <div className="center">
          {focusedCard && (
            <>
              <div className="name">
                <h2>{focusedCard.name}</h2>
              </div>
              <div className="graph-container">
                <Graph />
              </div>
              <div className="price">
                <h3>{simple_price}</h3>
              </div>
              <CardMarketButtons />
              <div className="quantity-text">
                You have {cardPositions[focusedCard.id] || 0} of this card
              </div>
            </>
          )}
        </div>
        <div className="right">
          <div className="card-display">{cardImg()}</div>
        </div>
      </div>
    </div>
  );
};

export default CardFocus;
