import FaceitStats from "../components/faceit/FaceitStats";
import FaceitStatsCompact from "../components/faceit/FaceitStatsCompact";
import FaceitStatsL from "../components/faceit/FaceitStatsL";
import FaceitStatsS from "../components/faceit/FaceitStatsS";

export default function FaceitStatsPage() {
  return (
    <div className="h-screen overflow-y-auto">
      <FaceitStatsCompact />
      {/* <FaceitStats />
      <FaceitStatsS />
      <FaceitStatsL /> */}
    </div>
  );
}
