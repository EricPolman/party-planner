export function InvitationNotFoundCard() {
  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-bold text-lg">Uitnodiging niet gevonden</h3>
      <div className="text-sm text-gray-600 mb-2">
        De uitnodiging met deze code bestaat niet of is verlopen.
      </div>
      <div className="text-sm text-gray-600 mb-2">
        Controleer of de code correct is, of neem contact op met de organisator.
      </div>
    </div>
  );
}
