import { Listner, OrderStatus, PaymentCreated, Subjects } from "@sj-bl/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";


export class PaymentCreatedListener extends Listner<PaymentCreated>{
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreated['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('order not found')
    }
    order.set({ status: OrderStatus.Complete })
    await order.save();
    msg.ack()
  }
}

