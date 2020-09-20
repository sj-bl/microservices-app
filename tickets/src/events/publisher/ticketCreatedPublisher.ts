import { Publisher, Subjects, TicketCreated } from "@sj-bl/common";


export class TicketCreatedPublisher extends Publisher<TicketCreated>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}