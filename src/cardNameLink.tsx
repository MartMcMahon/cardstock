import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { Dispatch } from "./store";
import { mainActions } from "./main_reducer";
import { clearSearchResults } from "./scryfall_reducer";
import { Card } from "./types/card";
import "./cardNameLink.css";

const CardNameLink = ({ card, isSearchResults }: { card: Card; isSearchResults: boolean }) => {
  const dispatch = useDispatch<Dispatch>();

  if (!card) {
    return <div>...</div>;
  }

  const handleMouseMove = debounce(
    (e: React.MouseEvent) => {
      dispatch(
        mainActions.mouseCard({
          card,
          pos: [e.clientX, e.clientY],
        })
      );
    },
    200,
    { leading: true }
  );

  const handleMouseLeave = debounce(() => {
    dispatch(mainActions.mouseLeaveCard(card));
  }, 100);

  return (
    <div
      className={
        "card-name-link " + (isSearchResults ? "search-results-list-link" : "")
      }
      key={card.id}
      onMouseDown={() => {
        // must be onMouseDown not onClick to prevent blur from firing before click
        dispatch(mainActions.selectCard(card));
        dispatch(clearSearchResults());
        dispatch(mainActions.mouseLeaveCard(card));
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {card.name}
    </div>
  );
};

export default CardNameLink;
