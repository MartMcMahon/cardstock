import { useDispatch } from "react-redux";
import { useAuth } from "./hooks/useAuth";
import { useSelect } from "./hooks/useSelect";
import { buy } from "./market_actions";
import { Dispatch } from "./store";
import "./cardMarketButtons.css";

const CardMarketButtons = () => {
  const { currentUser } = useAuth();
  const { selectedCard } = useSelect((state) => state.main);
  const dispatch = useDispatch<Dispatch>();

  if (!currentUser || !selectedCard) {
    return null;
  }

  return (
    <div className="card-market-buttons">
      <button
        className="card-market-button"
        onClick={() => {
          console.log(selectedCard);
          dispatch(buy(currentUser.uid, selectedCard.id, 1));
        }}
      >
        Buy
      </button>
      <button
        className="card-market-button"
        onClick={() => {
          {
            /* dispatch( sellCard({ card: selectedCard, amount: 1, id: selectedCard.id, })); */
          }
        }}
      >
        Sell
      </button>
    </div>
  );
};

export default CardMarketButtons;
