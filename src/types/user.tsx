type User = {
  uid: string;
  email: string;
  cash: number;
  cardPositions: { [key: string]: CardPosition };
};
type CardPosition = {
  uuid: string;
  amount: number;
  cost: number;
  diff?: number;
};
export type { User, CardPosition };
