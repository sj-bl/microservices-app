import mongoose from "mongoose";
import { Message } from "node-nats-streaming";


import { natsWrapper } from "../../../natsWrapper"
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticketUpdatedListener";
import { TicketUpdated } from "@sj-bl/common";


const setup = async () => {
  // create instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save ticket

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100,
  })
  await ticket.save()
  const data: TicketUpdated['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: 'New Concert',
    price: 9999,
  }


  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  // @ts-check
  return { listener, data, msg, ticket }
}

it('find,updates and save ticket ', async () => {

  const { listener, data, msg, ticket } = await setup();


  await listener.onMessage(data, msg)

  // write assertion to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).toBeDefined()
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);


})
it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  // call the message function with the data object + message object
  await listener.onMessage(data, msg)
  // write assertion to make sure a \ack func is called
  expect(msg.ack).toHaveBeenCalled()
})

it('does not called ack if event has a skipped version number', async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 10;
  try {
    await listener.onMessage(data, msg);

  } catch (error) {

  }

  expect(msg.ack).not.toHaveBeenCalled()

})
