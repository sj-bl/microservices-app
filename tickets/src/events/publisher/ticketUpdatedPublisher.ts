import { Publisher, Subjects, TicketUpdated } from "@sj-bl/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdated>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}