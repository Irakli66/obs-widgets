"use client";

import { useEffect } from "react";
import { createPusherClient } from "@/lib/pusher/pusher-client";
import { useSpinStore, SpinEvent } from "@/store/spinStore";

export default function SpinListener() {
  const setLatestSpin = useSpinStore((s) => s.setLatestSpin);
  const startSpin = useSpinStore((s) => s.startSpin);
  const finishSpin = useSpinStore((s) => s.finishSpin);
  const addRotation = useSpinStore((s) => s.addRotation);

  useEffect(() => {
    const pusher = createPusherClient();
    const channel = pusher.subscribe("spin-channel");

    channel.bind("spin-started", (spin: SpinEvent) => {
      setLatestSpin(spin);
      startSpin();

      const extraRotation = 1440 + Math.floor(Math.random() * 720);
      addRotation(extraRotation);

      setTimeout(() => {
        finishSpin(spin.outcome);
      }, 4200);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("spin-channel");
      pusher.disconnect();
    };
  }, [setLatestSpin, startSpin, finishSpin, addRotation]);

  return null;
}
