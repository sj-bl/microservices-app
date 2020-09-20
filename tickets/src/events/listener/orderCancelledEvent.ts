import { Listner, NotFoundError, OrderCancelledEvent, Subjects } from "@sj-bl/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../natsWrapper";
import { TicketUpdatedPublisher } from "../publisher/ticketUpdatedPublisher";
import { queueGroupName } from "./queueGroupName";


export class OrderCancenlledListener extends Listner<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    ticket.set({ orderId: undefined });
    await ticket.save()
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
      price: ticket.price
    })
    msg.ack()
  }

}