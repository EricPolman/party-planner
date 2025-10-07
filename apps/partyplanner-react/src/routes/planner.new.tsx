import { createFileRoute } from '@tanstack/react-router'
import { CreateEventForm } from '@/components/CreateEventForm'

export const Route = createFileRoute('/planner/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateEventForm />
}
