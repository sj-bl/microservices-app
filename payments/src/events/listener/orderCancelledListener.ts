import { Listner, OrderCancelledEvent, OrderStatus, Subjects } from "@sj-bl/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orderModel";
import { queueGroupName } from "./__test__/queueGroupName";

export class OrderCancelledListener extends Listner<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })
    if (!order) {
      throw new Error('not found')
    }
    order.set({ status: OrderStatus.Cancelled })
    await order.save()


    msg.ack();
  }
}
