import { useDispatch } from "react-redux";
import { useSelect } from "./hooks/useSelect";
import { mainActions } from "./main_reducer";
import "./cardMarketButtons.css";

const CardMarketButtons = () => {
  const { selectedCard } = useSelect((state) => state.main);
  const dispatch = useDispatch();

  return (
    <div className="card-market-buttons">
      <button
        className="card-market-button"
        onClick={() => {
          dispatch(
            mainActions.buyCard({
              card: selectedCard,
              amount: 1,
              id: selectedCard.id,
            })
          );
        }}
      >
        Buy
      </button>
      <button
        className="card-market-button"
        onClick={() => {
          dispatch(
            mainActions.sellCard({
              card: selectedCard,
              amount: 1,
              id: selectedCard.id,
            })
          );
        }}
      >
        Sell
      </button>
    </div>
  );
};

export default CardMarketButtons;
