import { Ticket } from "../../models/ticket"
import mongoose from 'mongoose'
import request from 'supertest';
import { app } from "../../app";
jest.mock('../../natsWrapper')

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 1234
  })
  await ticket.save();
  return ticket
}

it('fetches order for given user', async () => {
  // craete three ticket
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();
  // create two users
  const usersOne = global.getcookie();
  const userTwo = global.getcookie();

  // create order 
  // userone
  await request(app)
    .post('/api/orders')
    .set('Cookie', usersOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)
  // user2
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)
  //  get orders
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  // console.log(response.body)
  expect(response.body.length).toEqual(2)
})
