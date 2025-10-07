import HeaderUser from "@/integrations/clerk/header-user";
import Link from "next/link.js";

export default function Header() {
  return (
    <header className="p-2 h-12 flex gap-2 bg-gradient-to-r from-purple-800 to-blue-800 text-white justify-between items-center">
      <div>
        <Link href="/" className="text-white hover:text-gray-300 font-bold">
          JouwFeestjePlannen.nl
        </Link>
      </div>
      <HeaderUser />
    </header>
  );
}
