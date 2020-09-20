import { Listner, OrderCreatedEvent, Subjects } from "@sj-bl/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../queues/expirationQueue";
import { queueGroupName } from "./queueGroupName";


export class OrderCreatedListener extends Listner<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    await expirationQueue.add({
      orderId: data.id
    },
      {
        delay
      }
    )
    msg.ack()
  }
}