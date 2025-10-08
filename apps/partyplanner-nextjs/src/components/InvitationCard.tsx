import { Invitation } from "@/types/invitations";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";

export function InvitationCard({
  invitation,
}: {
  invitation: Omit<Invitation, "invitees"> & { organisers?: string[] };
}) {
  const startDate = new Date(invitation.startDate);
  const endDate = invitation.endDate ? new Date(invitation.endDate) : null;

  const sameDay = endDate ? isSameDay(startDate, endDate) : true;
  const startDateText = format(startDate, "PPP HH:mm", {
    locale: nl,
  });
  const endDateText = endDate
    ? format(endDate, sameDay ? "HH:mm" : "PPP HH:mm", {
        locale: nl,
      })
    : null;

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-bold text-lg">{invitation.title}</h3>
      {invitation.organisers && (
        <div className="text-sm text-gray-600 mb-2">
          Georganiseerd door: {invitation.organisers.join(", ")}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: invitation.message }} />
      <table>
        <tbody>
          <tr>
            <td className="w-32">🕙 Wanneer?</td>
            <td>
              {startDateText}
              {invitation.endDate && <> tot {endDateText}</>}
            </td>
          </tr>
          <tr>
            <td className="w-32">📍 Waar?</td>
            <td>{invitation.location}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
