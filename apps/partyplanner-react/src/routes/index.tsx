import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <Link to="/planner">
        <Button>Naar planner</Button>
      </Link>
    </div>
  )
}
