import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelect } from "./hooks/useSelect";
import { fetchFailed } from "./api_reducer";
import { Dispatch } from "./store";
import { Tx } from "./types/market";

const Networth = () => {
  const dispatch = useDispatch<Dispatch>();
  const { cardPositions, txData } = useSelect((store) => store.user);

  const [networth, setNetWorth] = useState(0);




    // const networth = txData.reduce((acc: number, tx: Tx) => {
    //   const price = getPrice(tx.uuid);
    //   console.log('getPrice', tx, acc)
    //   return acc + price * tx.amount;
    // }, 1000);

    // setNetWorth(networth);
  // }, [dispatch, txData]);

  return <div>{networth}</div>;
};

export default Networth;
