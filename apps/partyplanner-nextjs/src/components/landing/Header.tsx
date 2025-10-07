"use client";

import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 pl-6">
          <PartyPopper className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">
            JouwFeestjePlannen.nl
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/planner")}
          >
            Aanmelden
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/planner")}
          >
            Aan de slag
          </Button>
        </div>
      </div>
    </header>
  );
}
