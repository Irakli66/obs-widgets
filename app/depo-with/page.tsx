import { Suspense } from "react";
import DepositWithdraw from "../components/DepositWithdraw";

export default function DepoWithPage() {
  return (
    <Suspense fallback={<div>Loading stats...</div>}>
      <DepositWithdraw />;
    </Suspense>
  );
}
