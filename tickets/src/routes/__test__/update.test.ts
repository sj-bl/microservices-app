import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../app'
import { Ticket } from '../../models/tickets';
import mongoose from 'mongoose';


jest.mock('../../natsWrapper.ts')

const createTicket = async (cookie: string[]) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'T1', price: 10 })
    .expect(201);
}


it('return 404 if id doest exist', async () => {
  await request(app)
    .put('/api/tickets/5f426dab0949de0018b6ad8c')
    .set('Cookie', global.getcookie())
    .send({ title: 'dfghgfhdgsfa', price: 12 })
    .expect(404)

})
it('return 401 if User is not signed in', async () => {
  const { body: { id } } = await createTicket(global.getcookie())
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'dfghgfhdgsfa', price: 12 })
    .expect(401)
})
it('return 401 if user not owns tickets', async () => {

  // create ticket
  const { body: { id } } = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getcookie())
    .send({ title: 'T1', price: 10 })
    .expect(201);
  // try to update ticket with another user
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getcookie())
    .send({ title: 'dfghgfhdgsfa', price: 12 })
    .expect(401)
})
it('return 400 if user provide invalid title and price', async () => {
  const cookie = global.getcookie();
  const { body: { id } } = await createTicket(cookie)

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 10 })
    .expect(400)
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ price: -10 })
    .expect(400)
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: '' })
    .expect(400)
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'asdfg', price: -10 })
    .expect(400)
})
it('update ticket if user is valid and provide valid title and price ', async () => {
  const cookie = global.getcookie();
  const { body: { id } } = await createTicket(cookie)
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'asdfg', price: 20 })
    .expect(200)
  const res = await request(app).get(`/api/tickets/${id}`).send();
  // console.log(res.body)
  expect(res.body.title).toEqual('asdfg')
  expect(res.body.price).toEqual(20)
})

it('reject updates if the ticket is reserved', async () => {
  const cookie = global.getcookie();
  const { body: { id } } = await createTicket(cookie)
  const ticket = await Ticket.findById(id)
  expect(ticket).toBeDefined()
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
  await ticket!.save()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'asdfg', price: 20 })
    .expect(400)
})












