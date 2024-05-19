import { useDispatch } from "react-redux";
import { useSelect } from "./hooks/useSelect";
import "./cardMarketButtons.css";

const CardMarketButtons = () => {
  const { selectedCard } = useSelect((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="card-market-buttons">
      <button
        className="card-market-button"
        onClick={() =>
          dispatch({
            type: "sendwsMessage",
            msg: JSON.stringify({
              action: "buy",
              cardId: selectedCard.id,
            }),
          })
        }
      >
        Buy
      </button>
      <button
        className="card-market-button"
        onClick={() => dispatch({ type: "sell", amount: 1 })}
      >
        Sell
      </button>
    </div>
  );
};

export default CardMarketButtons;
