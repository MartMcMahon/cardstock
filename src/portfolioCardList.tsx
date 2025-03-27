import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CardNameLink from "./cardNameLink";

import { Dispatch } from "./store";
import { fetchCardById } from "./scryfall";
import { useSelect } from "./hooks/useSelect";
import { CardPosition } from "./types/user";
import { Card, getSimplePrice } from "./types/card";

const PortfolioCardList = () => {
  const { cardData } = useSelect((state) => state.main);
  const cardPositions = useSelect((state) => state.user.cardPositions);

  const dispatch = useDispatch<Dispatch>();

  // useEffect(() => {
  //   const cp = { ...cardPositions };
  //   for (const tx of txData) {
  //     let current_price = 0;
  //     if (tx.uuid in cardData) {
  //       current_price = getSimplePrice(cardData[tx.uuid]);
  //     }
  //     cp[tx.uuid] = { amount: tx.amount, diff: current_price - tx.cost };
  //     setCardPositions(cp);
  //   }
  // }, [cardData,  txData]);

  return (
    <div className="portfolioCardList">
      Your Cards
      {Object.entries(cardPositions as { [key: string]: CardPosition }).map(
        ([id, pos]: [string, CardPosition]) => {
          console.log("id", id);
          console.log("pos", pos);
          const { amount, _cost } = pos;
          let card: Card;
          if (id in cardData) {
            card = cardData[id];
          } else {
            dispatch(fetchCardById(id));
            card = cardData[id];
          }

          return (
            <div className="portfolioCardEntry">
              <CardNameLink
                card={card}
                isSearchResults={false}
                amount={amount}
              />
            </div>
          );
        }
      )}
    </div>
  );
};

export default PortfolioCardList;
