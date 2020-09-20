import { Listner, Subjects, TicketUpdated } from "@sj-bl/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listner<TicketUpdated>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdated['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket Not Found')
    }

    const { title, price } = data;

    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }
}
