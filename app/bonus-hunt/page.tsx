import BonustHuntsList from "../components/bonus-hunt/BonusHuntsList";

export type BonusHunt = {
  id: number;
  name: string;
  startBalance: number;
  currentBalance: number;
  createdAt: Date;
  bonuses: Bonus[];
  avrgBet: number;
  avrgBEX: number;
  currentAvrgX: number;
};

export type Bonus = {
  id: number;
  name: string;
  betSize: number;
  paid: number;
  paidX: number;
};

export default async function BonustHuntsPage() {
  return <BonustHuntsList />;
}
