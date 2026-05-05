"use client";

import { useEffect, useRef } from "react";
import { createPusherClient } from "@/lib/pusher/pusher-client";
import { useSpinStore, SpinEvent } from "@/store/spinStore";
import { SPIN_TILE_GAP, SPIN_TILE_WIDTH } from "@/lib/spin-config";

export default function SpinListener() {
  const setLatestSpin = useSpinStore((s) => s.setLatestSpin);
  const startPrepare = useSpinStore((s) => s.startPrepare);
  const startSpin = useSpinStore((s) => s.startSpin);
  const finishSpin = useSpinStore((s) => s.finishSpin);
  const setRotation = useSpinStore((s) => s.setRotation);

  const spinQueueRef = useRef<SpinEvent[]>([]);
  const isProcessingRef = useRef(false);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prepareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const runNextSpin = () => {
      if (isProcessingRef.current) return;

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      const nextSpin = spinQueueRef.current.shift();
      if (!nextSpin) return;

      const reel = useSpinStore.getState().reel;

      if (reel.length === 0) {
        spinQueueRef.current.unshift(nextSpin);
        setTimeout(runNextSpin, 150);
        return;
      }

      isProcessingRef.current = true;
      setLatestSpin(nextSpin);
      startPrepare();

      const step = SPIN_TILE_WIDTH + SPIN_TILE_GAP;

      // Important: reset while reel is hidden during prepare.
      // This prevents the finite reel from moving out of view.
      setRotation(0);

      const safeStartIndex = 90;
      const safeEndIndex = reel.length - 20;

      const matchingIndexes = reel
        .map((item, index) => ({ id: item.id, index }))
        .filter(
          (item) =>
            item.id === nextSpin.outcome.id &&
            item.index >= safeStartIndex &&
            item.index <= safeEndIndex,
        )
        .map((item) => item.index);

      if (matchingIndexes.length === 0) {
        console.error("Outcome not found in safe reel area:", nextSpin.outcome);
        isProcessingRef.current = false;
        return;
      }

      const selectedIndex =
        matchingIndexes[Math.floor(Math.random() * matchingIndexes.length)];

      const spinDuration = 4.2 + Math.random() * 0.7;
      const prepareDuration = 950;

      prepareTimeoutRef.current = setTimeout(() => {
        startSpin(spinDuration);

        const audio = new Audio("/sounds/spinAudio.mp3");
        audio.volume = 0.7;
        audio.currentTime = 0;
        audio.play().catch(() => {});

        const targetOffset = selectedIndex * step;
        setRotation(targetOffset);
      }, prepareDuration);

      finishTimeoutRef.current = setTimeout(
        () => {
          finishSpin(nextSpin.outcome);
          isProcessingRef.current = false;

          if (spinQueueRef.current.length > 0) {
            runNextSpin();
          } else {
            hideTimeoutRef.current = setTimeout(() => {
              setLatestSpin(null);
            }, 1000);
          }
        },
        Math.round(prepareDuration + spinDuration * 1000 + 150),
      );
    };

    const pusher = createPusherClient();
    const channel = pusher.subscribe("spin-channel");

    channel.bind("spin-started", (spin: SpinEvent) => {
      spinQueueRef.current.push(spin);
      runNextSpin();
    });

    return () => {
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (prepareTimeoutRef.current) clearTimeout(prepareTimeoutRef.current);

      spinQueueRef.current = [];
      isProcessingRef.current = false;
      setLatestSpin(null);
      setRotation(0);

      channel.unbind_all();
      pusher.unsubscribe("spin-channel");
      pusher.disconnect();
    };
  }, [setLatestSpin, startPrepare, startSpin, finishSpin, setRotation]);

  return null;
}
