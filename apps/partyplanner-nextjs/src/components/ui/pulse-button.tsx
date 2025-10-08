"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PulseButtonProps {
  children: React.ReactNode;
  color: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "lg" | "default" | "icon" | null | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function PulseButton({
  children,
  color,
  className,
  type,
  size,
  onClick,
}: PulseButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false);
  const [pulseOrigin, setPulseOrigin] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setPulseOrigin({ x, y });
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1000);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        size={size}
        className={cn(
          color,
          "relative z-10 text-white hover:opacity-90",
          className
        )}
        type={type}
      >
        {children}
      </Button>

      {isPulsing && (
        <div
          className={cn("fixed pointer-events-none rounded-full", color)}
          style={{
            left: pulseOrigin.x,
            top: pulseOrigin.y,
            width: "0px",
            height: "0px",
            transform: "translate(-50%, -50%)",
            animation: "pulseFromOrigin 1s ease-out forwards",
          }}
        />
      )}
    </>
  );
}
