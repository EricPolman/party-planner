import { Link } from '@tanstack/react-router'
import ClerkHeader from '../integrations/clerk/header-user.tsx'

export default function Header() {
  return (
    <header className="p-2 h-12 flex gap-2 bg-gradient-to-r from-purple-800 to-blue-800 text-white justify-between items-center">
      <div>
        <Link to="/" className="text-white hover:text-gray-300 font-bold">
          PartyPlanner
        </Link>
      </div>
      <div>
        <ClerkHeader />
      </div>
    </header>
  )
}
