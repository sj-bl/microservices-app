import mongoose from "mongoose"
import { ExpirationCompleteEvent } from '@sj-bl/common'
import { Order, OrderStatus } from "../../../models/order"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../natsWrapper"
import { ExpirationCompleteListener } from "../expirationCompleteListener"
import { Message } from "node-nats-streaming"

// const setup = async () => {
//   const listener = await new ExpirationCompleteListener(natsWrapper.client)

//   const ticket = Ticket.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     title: 'concert',
//     price: 200
//   })
//   await ticket.save();
//   const order = Order.build({
//     status: OrderStatus.Created,
//     userId: 'alskdfj',
//     expiresAt: new Date(),
//     ticket,

//   })

//   await order.save();
//   const data: ExpirationCompleteEvent['data'] = {
//     orderId: order.id
//   }
//   // @ts-ignore
//   const msg: Message = {
//     ack: jest.fn()
//   }
//   return { listener, order, ticket, data, msg }
// }

// it('updates the order status to cancelled', async () => {
//   const { listener, order, ticket, data, msg } = await setup();

//   await listener.onMessage(data, msg);

//   const updatedOrder = await Order.findById(order.id)

//   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
// })

// it('acks the message', async () => {
//   const { listener, order, ticket, data, msg } = await setup();

//   await listener.onMessage(data, msg);

//   expect(msg.ack).toHaveBeenCalled()

// })
// it('emit order cancelled event', async () => {
//   const { listener, order, ticket, data, msg } = await setup();

//   await listener.onMessage(data, msg);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();

//   console.log({ order, ticket, event: (natsWrapper.client.publish as jest.Mock).mock.calls[0][1] })
//   const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
//   console.log(eventData)
//   expect(eventData.id).toEqual(order.id)
// })

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})