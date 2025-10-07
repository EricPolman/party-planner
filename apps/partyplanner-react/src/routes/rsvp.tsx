import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rsvp')({
  component: RsvpComponent,
})

function RsvpComponent() {
  return (
    <div className="p-2 flex gap-2">
      <Outlet />
    </div>
  )
}
