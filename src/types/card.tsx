import ScryfallCard from "./scryfallCard";

type BasicCard = {
  id: string;
  name: string;
  prices: {
    usd: number;
    usd_foil: number;
    usd_etched: number;
    eur: number;
    eur_foil: number;
    tix: number;
  };
};
export type { BasicCard };
export type Card = BasicCard | ScryfallCard;
