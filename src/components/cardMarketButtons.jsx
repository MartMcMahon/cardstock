import { useDispatch, useSelector } from "react-redux";
import "./cardMarketButtons.css";

const CardMarketButtons = (props) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="card-market-buttons">
      <button
        className="card-market-button"
        onClick={() =>
          dispatch({
            type: "sendwsMessage",
            msg: JSON.stringify({ action: "buy", cardId: state.selectedCard.id }),
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
