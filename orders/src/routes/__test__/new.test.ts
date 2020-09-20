
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';



jest.mock('../../natsWrapper')


it('return 401 if user is not signed in ', async () => {
  await request(app).post('/api/orders').send({}).expect(401);
})
it('returns other than 401 if user is signed in', async () => {

  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', global.getcookie())
    .send({});
  expect(res.status).not.toEqual(401);
})
it('returns error if ticket id isnt provided', async () => {
  await request(app)
    .
    post('/api/orders')
    .set('Cookie', global.getcookie())
    .send({ ticketId: '' }).expect(400);

})
it('return Error if invalid id ', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getcookie())
    .send({ ticketId: '12345654321' })
    .expect(400);
  ;
})


it('return an error if the ticket does not exist', async () => {
  const createId = mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getcookie())
    .send({ ticketId: createId })
    .expect(404);
})

it('return an error if the ticket is already reserved', async () => {


  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'this is reserved', price: 100 });
  await ticket.save();
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15 * 60)
  const order = Order.build({
    userId: `${mongoose.Types.ObjectId()}`,
    expiresAt: expiration,
    ticket,
    status: OrderStatus.Created
  })
  await order.save()
  const data = await request(app)
    .post('/api/orders')
    .set('Cookie', global.getcookie())
    .send({ ticketId: ticket._id })
    .expect(400);

})

it('reserved the ticket', async () => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'this is reserved', price: 100 });
  await ticket.save();


  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getcookie())
    .send({ ticketId: ticket.id })
    .expect(201)

})
it('emits event when order created', async () => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'this is reserved', price: 100 });
  await ticket.save();


  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getcookie())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})



// it('create ticket for valid input', async () => {
//   let tickets = await Ticket.find({});
//   expect(tickets.length).toEqual(0);

//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.getcookie())
//     .send({ title: 'sdfghjkl', price: 100 })
//     .expect(201)

//   tickets = await Ticket.find({});
//   expect(tickets.length).toEqual(1);
// })

// it('publish event after ticket creation', async () => {
//   let tickets = await Ticket.find({});
//   expect(tickets.length).toEqual(0);

//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.getcookie())
//     .send({ title: 'sdfghjkl', price: 100 })
//     .expect(201)

//   tickets = await Ticket.find({});
//   expect(tickets.length).toEqual(1);
//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// })