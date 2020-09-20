import { OrderCreatedEvent, OrderStatus } from "@sj-bl/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../natsWrapper"
import { OrderCreatedListener } from "../orderCreatedListener"

const setup = async () => {
  // create an instance of listener

  const listener = new OrderCreatedListener(natsWrapper.client)

  // create and save ticket 

  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: mongoose.Types.ObjectId().toHexString(),
  })

  await ticket.save()

  // create the fake data event

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'asdfgfds',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}


it('sets the userid of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  console.log(ticket.id)

  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)

})


it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled();
})


it('publishes ticket updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  // @ts-ignore
  console.log(natsWrapper.client.publish.mock.calls)
})