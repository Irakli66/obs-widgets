"use client";

import SpinListener from "../components/spin/SpinListener";
import SpinWheel from "../components/spin/SpinWheel";

export default function SpinPage() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <SpinListener />
      <SpinWheel />
    </div>
  );
}
