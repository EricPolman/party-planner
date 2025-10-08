export enum InviteeResponseStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  MAYBE = "MAYBE",
  PENDING = "PENDING",
}

export interface Invitee {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string | null;
  status: InviteeResponseStatus;
  comments: string | null;
  respondedAt: string | null;
}
