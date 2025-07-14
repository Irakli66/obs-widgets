"use client";
import { useSearchParams } from "next/navigation";
import FaceitStatsCompact from "./FaceitStatsCompact";
import FaceitStatsS from "./FaceitStatsS";

export default function FaceitStatsLayout() {
  const searchParams = useSearchParams();
  const compact = searchParams.get("compact") === "true";
  return <div>{compact ? <FaceitStatsCompact /> : <FaceitStatsS />}</div>;
}
