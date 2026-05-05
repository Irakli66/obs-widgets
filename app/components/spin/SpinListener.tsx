"use client";

import { useEffect, useRef } from "react";
import { createPusherClient } from "@/lib/pusher/pusher-client";
import { useSpinStore, SpinEvent } from "@/store/spinStore";
import {
  getSpinReelPattern,
  SPIN_REEL_REPEATS,
  SPIN_TILE_GAP,
  SPIN_TILE_WIDTH,
} from "@/lib/spin-config";

function getBaitOffset(step: number, outcomeId: string) {
  const shouldBait = Math.random() < 0.5;

  if (!shouldBait) {
    return Math.floor((Math.random() - 0.5) * step * 0.22);
  }

  if (outcomeId === "try-again") {
    return Math.floor(step * 0.42);
  }

  return Math.floor((Math.random() - 0.5) * step * 0.5);
}

export default function SpinListener() {
  const setLatestSpin = useSpinStore((s) => s.setLatestSpin);
  const startPrepare = useSpinStore((s) => s.startPrepare);
  const startSpin = useSpinStore((s) => s.startSpin);
  const finishSpin = useSpinStore((s) => s.finishSpin);
  const addRotation = useSpinStore((s) => s.addRotation);
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

      isProcessingRef.current = true;
      setLatestSpin(nextSpin);
      startPrepare();

      const weightedPattern = getSpinReelPattern();

      const step = SPIN_TILE_WIDTH + SPIN_TILE_GAP;
      const patternCount = weightedPattern.length;
      const cycleSize = step * Math.max(1, patternCount);

      const currentOffset = useSpinStore.getState().rotation;
      const normalizedOffset =
        ((currentOffset % cycleSize) + cycleSize) % cycleSize;

      setRotation(normalizedOffset);

      const matchingPatternIndexes = weightedPattern
        .map((outcome, index) => ({ id: outcome.id, index }))
        .filter((item) => item.id === nextSpin.outcome.id)
        .map((item) => item.index);

      const selectedPatternIndex =
        matchingPatternIndexes[
          Math.floor(Math.random() * Math.max(1, matchingPatternIndexes.length))
        ];

      const reelCycles = Math.max(2, Math.floor(SPIN_REEL_REPEATS * 0.12));
      const extraCycles = Math.floor(Math.random() * 3);
      const spinDuration = 4.2 + Math.random() * 0.8;
      const prepareDuration = 950;
      const fallbackExtraRotation = cycleSize * 10;

      prepareTimeoutRef.current = setTimeout(() => {
        startSpin(spinDuration);

        if (
          selectedPatternIndex === undefined ||
          Number.isNaN(selectedPatternIndex) ||
          patternCount === 0
        ) {
          addRotation(fallbackExtraRotation);
        } else {
          const currentOffsetInCycle = useSpinStore.getState().rotation;
          const baitOffset = getBaitOffset(step, nextSpin.outcome.id);

          const targetOffsetInCycle = selectedPatternIndex * step + baitOffset;

          let alignDelta = targetOffsetInCycle - currentOffsetInCycle;

          if (alignDelta < 0) {
            alignDelta += cycleSize;
          }

          const deltaToTarget =
            cycleSize * (reelCycles + extraCycles) + alignDelta;

          addRotation(deltaToTarget);
        }
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
        Math.round(prepareDuration + spinDuration * 1000 + 200),
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

      channel.unbind_all();
      pusher.unsubscribe("spin-channel");
      pusher.disconnect();
    };
  }, [
    setLatestSpin,
    startPrepare,
    startSpin,
    finishSpin,
    addRotation,
    setRotation,
  ]);

  return null;
}
