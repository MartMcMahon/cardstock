import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { Dispatch } from "./store";
import { mouseCard, mouseLeaveCard, selectCard } from "./main_reducer";
import { clearSearchResults } from "./scryfall_reducer";
import { Card } from "./types/card";
import "./cardNameLink.css";

const CardNameLink = ({
  card,
  isSearchResults,
  amount
}: {
  card: Card;
  isSearchResults: boolean;
  amount: number;
}) => {
  const dispatch = useDispatch<Dispatch>();

  if (!card) {
    return <div>...</div>;
  }

  const handleMouseMove = debounce(
    (e: React.MouseEvent) => {
      dispatch(
        mouseCard({
          card,
          pos: [e.clientX, e.clientY],
        })
      );
    },
    200,
    { leading: true }
  );

  const handleMouseLeave = debounce(() => {
    dispatch(mouseLeaveCard(card));
  }, 100);

  return (
    <div
      className={
        "card-name-link " + (isSearchResults ? "search-results-list-link" : "")
      }
      key={card.id}
      onMouseDown={() => {
        // must be onMouseDown not onClick to prevent blur from firing before click
        dispatch(selectCard(card));
        dispatch(clearSearchResults());
        dispatch(mouseLeaveCard(card));
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {card.name}
                      <div>{amount !== 0 && `: ${amount}`}</div>
    </div>
  );
};

export default CardNameLink;
