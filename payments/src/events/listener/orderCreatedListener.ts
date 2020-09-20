import { Listner, OrderCreatedEvent, Subjects } from "@sj-bl/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orderModel";
import { queueGroupName } from "./__test__/queueGroupName";


export class OrderCreatedListener extends Listner<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price
    })
    await order.save();

    msg.ack();
  }
}
