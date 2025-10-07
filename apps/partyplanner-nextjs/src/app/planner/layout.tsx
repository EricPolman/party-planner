import { Header } from "@/components/Header";

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container pt-4">{children}</div>
    </div>
  );
}
