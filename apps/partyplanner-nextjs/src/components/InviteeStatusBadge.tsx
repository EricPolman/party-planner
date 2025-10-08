import { InviteeResponseStatus } from "@/types/invitees";
import { match } from "ts-pattern";

export function InviteeStatusBadge({
  status,
}: {
  status: InviteeResponseStatus;
}) {
  return match(status)
    .with(InviteeResponseStatus.ACCEPTED, () => (
      <span className="bg-green-600 text-white px-2 py-1 rounded font-semibold">
        Aanwezig
      </span>
    ))
    .with(InviteeResponseStatus.DECLINED, () => (
      <span className="bg-red-600 text-white px-2 py-1 rounded font-semibold">
        Afwezig
      </span>
    ))
    .with(InviteeResponseStatus.MAYBE, () => (
      <span className="bg-yellow-600 text-white px-2 py-1 rounded font-semibold">
        Misschien
      </span>
    ))
    .with(InviteeResponseStatus.PENDING, () => (
      <span className="bg-gray-600 text-white px-2 py-1 rounded font-semibold">
        In afwachting
      </span>
    ))
    .exhaustive();
}
