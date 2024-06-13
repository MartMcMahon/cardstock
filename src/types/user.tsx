type User = {
  uid: string;
  email: string;
  cash: number;
  cardPositions: { [key: string]: number };
};
export type { User };
