export enum InviteeResponseStatus {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  MAYBE = "MAYBE",
  PENDING = "PENDING",
}

export interface Invitee {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  status: InviteeResponseStatus;
  comments: string | null;
  respondedAt: string | null;
}
