import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/planner')({
  component: PlannerComponent,
})

function PlannerComponent() {
  return (
    <div className="p-2 flex gap-2">
      <Outlet />
    </div>
  )
}
