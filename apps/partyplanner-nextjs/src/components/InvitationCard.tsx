import { Invitation } from "@/types/invitations";

export function InvitationCard({
  invitation,
}: {
  invitation: Omit<Invitation, "invitees"> & { organisers?: string[] };
}) {
  const dateText = new Date(invitation.startDate).toLocaleString().slice(0, -3);

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
            <td>{dateText}</td>
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
