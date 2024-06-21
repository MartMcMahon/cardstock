import ScryfallCard from "./scryfallCard";

// type BasicCard = {
//   id: string;
//   name: string;
//   prices: {
//     usd: number;
//     usd_foil: number;
//     usd_etched: number;
//     eur: number;
//     eur_foil: number;
//     tix: number;
//   };
// };

const getSimplePrice = (card: Card): number => {
  let res;
  if (card.prices.usd) {
    res = card.prices.usd;
  }
  if (card.prices.usd_foil) {
    res = card.prices.usd_foil;
  }
  if (card.prices.usd_etched) {
    res = card.prices.usd_etched;
  }
  if (card.prices.eur) {
    res = card.prices.eur;
  }
  if (card.prices.eur_foil) {
    res = card.prices.eur_foil;
  }
  if (card.prices.tix) {
    res = card.prices.tix;
  }
  if (typeof res === "number") {
    return res;
  }
  return parseFloat(res || "0");
};

// export type { BasicCard };
export { getSimplePrice };
export type Card = ScryfallCard;
