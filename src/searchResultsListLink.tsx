import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { Dispatch } from "./store";
import { mainActions } from "./main_reducer";
import { clearSearchResults } from "./scryfall_reducer";
import { Card } from "./types/card";
import "./cardNameLink.css";

const SearchResultsListLink = ({ card }: { card: Card }) => {
  // const { cardData } = useSelect((state) => state.main);
  const dispatch = useDispatch<Dispatch>();
  // const [card, setCard] = useState<Card | null>(null);

  // useEffect(() => {
  //   let card;
  //   if (id in cardData) {
  //     card = cardData[id];
  //     setCard(card);
  //   } else {
  //     card = cardData[id];
  //     dispatch(mainActions.fillCardData({ card }));
  //     setCard(card);
  //   }
  // }, [id, cardData, dispatch]);

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
      className={"search-results-list-link"}
      key={card.id}
      onClick={() => {
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

export default SearchResultsListLink;
