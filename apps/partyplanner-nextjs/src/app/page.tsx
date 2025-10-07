"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello, PartyPlanner!</h1>
      <Button variant="outline" onClick={() => router.push("/planner")}>
        Go to planner
      </Button>
    </div>
  );
}
