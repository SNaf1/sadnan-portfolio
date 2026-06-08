"use client";

import React, { useRef, useState, MouseEvent } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [sheenStyle, setSheenStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position of cursor relative to card bounds (0 to width, 0 to height)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Relative position normalized from -0.5 to 0.5
    const rX = (mouseX / width - 0.5) * 2; // -1 to 1
    const rY = (mouseY / height - 0.5) * 2; // -1 to 1

    // Increased tilt angle (max 15 degrees tilt for higher noticeability)
    const tiltMax = 15;
    const rotateY = rX * tiltMax;
    const rotateX = -rY * tiltMax;

    // Increased scale for zoom pop effect
    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
    );

    // Calculate light sheen spot coordinates
    const sheenX = (mouseX / width) * 100;
    const sheenY = (mouseY / height) * 100;

    // Higher sheen opacity and blur size for strong highlights
    setSheenStyle({
      opacity: 0.35,
      background: `radial-gradient(circle 200px at ${sheenX}% ${sheenY}%, rgba(59, 130, 246, 0.65), transparent 80%)`,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth transition back to neutral
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSheenStyle({
      opacity: 0,
      transition: "all 0.4s ease-out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? "transform 0.05s ease-out" : "transform 0.4s ease-out",
        willChange: "transform",
      }}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isHovered
          ? "border-blue-500/50 shadow-2xl shadow-blue-500/10"
          : "border-zinc-200 dark:border-zinc-900"
      } ${className}`}
    >
      {/* Sheen Overlay Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={sheenStyle}
      />
      {children}
    </div>
  );
}
