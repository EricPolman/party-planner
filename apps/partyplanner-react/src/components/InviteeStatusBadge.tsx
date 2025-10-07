import { match } from 'ts-pattern'
import { PlannerEventInviteeResponseStatus } from '@/hooks/useEvents'

export function InviteeStatusBadge({
  status,
}: {
  status: PlannerEventInviteeResponseStatus
}) {
  return match(status)
    .with(PlannerEventInviteeResponseStatus.ACCEPTED, () => (
      <span className="bg-green-600 text-white px-2 py-1 rounded font-semibold">
        Aanwezig
      </span>
    ))
    .with(PlannerEventInviteeResponseStatus.DECLINED, () => (
      <span className="bg-red-600 text-white px-2 py-1 rounded font-semibold">
        Afwezig
      </span>
    ))
    .with(PlannerEventInviteeResponseStatus.MAYBE, () => (
      <span className="bg-yellow-600 text-white px-2 py-1 rounded font-semibold">
        Misschien
      </span>
    ))
    .with(PlannerEventInviteeResponseStatus.NONE, () => (
      <span className="bg-gray-600 text-white px-2 py-1 rounded font-semibold">
        In afwachting
      </span>
    ))
    .exhaustive()
}
