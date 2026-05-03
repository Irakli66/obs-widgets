"use client";

import SpinListener from "../components/spin/SpinListener";
import SpinWheel from "../components/spin/SpinWheel";

export default function SpinPage() {
  return (
    <div className="min-h-screen bg-black/45 flex items-center justify-center px-6 backdrop-blur-[1px]">
      <SpinListener />
      <SpinWheel />
    </div>
  );
}
