"use client";
import React from "react";
import { WavyBackground } from "./../ui/wavy-background.tsx";

export function WaveAd() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl pt-20 text-white font-bold inter-var text-center">
      
      Meliora: We Make Your Home Shine Brighter Than Your Future!
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
      Making Your Home So Clean, Even Your Mother-in-Law Will Be Impressed! 
      </p>
    </WavyBackground>
  );
}
