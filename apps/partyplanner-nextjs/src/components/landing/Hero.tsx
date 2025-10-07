import { Calendar, Sparkles, Users } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Plan onvergeetbare feestjes</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              Moeiteloos jouw feestjes organiseren
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-xl">
              Van verjaardagen tot bruiloften, organiseer elk detail op één
              plek. Beheer gasten, uitnodigingen, taken en meer met gemak.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/planner">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
                >
                  Start met plannen
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Onbeperkt aantal gasten
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Altijd overzichtelijke agenda
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
                <Image
                  src="/festival-confetti-explosion-stockcake.jpg"
                  alt="Party planning dashboard"
                  className="w-full rounded-2xl h-[500px] object-cover"
                  width={500}
                  height={500}
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
