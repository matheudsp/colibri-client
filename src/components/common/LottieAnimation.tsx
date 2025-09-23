"use client";

import { Player } from "@lottiefiles/react-lottie-player";

interface LottieAnimationProps {
  animationData: unknown;
  className?: string;
}

export function LottieAnimation({
  animationData,
  className,
}: LottieAnimationProps) {
  return (
    <Player autoplay loop src={animationData as string} className={className} />
  );
}
