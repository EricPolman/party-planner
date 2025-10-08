import { Invitee } from "./invitees";

export interface Invitation {
  id: string;
  eventId: string;
  code: string;
  title: string;
  message: string;
  isActive: boolean;
  location: string | null;
  startDate: string;
  endDate: string | null;
  invitees: Array<Invitee>;
}
