type Card = {
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
export type { Card };
