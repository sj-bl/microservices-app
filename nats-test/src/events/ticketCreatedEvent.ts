import { Subjects } from "./Subjects";

export interface TicketCreated {
  subject: Subjects.TicketCreated;
  data: {
    id: string;

    title: string;
    price: number;
  }
}