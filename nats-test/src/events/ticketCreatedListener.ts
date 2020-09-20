import { Listner } from './baseListener'
import { Message } from 'node-nats-streaming'
import { Subjects } from './Subjects';
import { TicketCreated } from './ticketCreatedEvent'

export class TicketCreatedListener extends Listner<TicketCreated>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payment-service';
  onMessage(data: TicketCreated['data'], msg: Message) {
    console.log('Event Recieved', data);

    msg.ack();
  }
}


