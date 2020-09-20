import { Publisher } from "./basePublisher";
import { Subjects } from "./Subjects";
import { TicketCreated } from './ticketCreatedEvent'

export class TicketCreatedPublisher extends Publisher<TicketCreated>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
