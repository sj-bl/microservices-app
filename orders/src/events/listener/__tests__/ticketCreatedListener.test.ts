import { natsWrapper } from "../../../natsWrapper"
import { TicketCreatedListner } from "../ticketCreatedListener"
import { TicketCreated } from '@sj-bl/common'
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";


const setup = async () => {
  // create instance of listener
  const listener = new TicketCreatedListner(natsWrapper.client);
  // create fake data event
  const data: TicketCreated['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100,
  }
  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  // @ts-check
  return { listener, data, msg }
}

it('create and saves a ticket ', async () => {

  const { listener, data, msg } = await setup();

  // call the message function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertion to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined()
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);


})
it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  // call the message function with the data object + message object
  await listener.onMessage(data, msg)
  // write assertion to make sure a \ack func is called
  expect(msg.ack).toHaveBeenCalled()
})

