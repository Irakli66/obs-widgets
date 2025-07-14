// import FaceitStats from "../components/faceit/FaceitStats";
// import FaceitStatsCompact from "../components/faceit/FaceitStatsCompact";

import { Suspense } from "react";
import FaceitStatsLayout from "../components/faceit/FaceitStatsLayout";

export default function FaceitStatsPage() {
  return (
    <div className="h-screen overflow-y-auto">
      <Suspense fallback={<div>Loading stats...</div>}>
        <FaceitStatsLayout />
      </Suspense>
    </div>
  );
}
