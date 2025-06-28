"use client";
import { useRequest } from "@/lib/hooks/useRequest";
import Image from "next/image";

export default function FaceitStats() {
  const {
    data: statsData,
    error: statsError,
    isLoading: statsLoading,
  } = useRequest<any>("/api/faceit/stats");

  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
  } = useRequest<any>("/api/faceit/matches");

  const {
    data: faceitData,
    error: faceitError,
    isLoading: faceitLoading,
  } = useRequest<any>("/api/faceit");

  //   console.log("faceit:", faceitData);
  console.log("stats:", statsData);
  //   console.log("matches:", matchesData);
  return (
    <div className="flex space-x-10 items-center ">
      <Image
        src={faceitData?.avatar || "/default-avatar.png"}
        alt="avatar"
        width={60}
        height={60}
        className="rounded-full"
      />
      <p>{faceitData?.nickname}</p>
      <p>{faceitData?.games.cs2.faceit_elo}</p>
      <p>{faceitData?.games.cs2.skill_level}</p>
    </div>
  );
}
