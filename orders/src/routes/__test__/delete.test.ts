import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';

jest.mock('../../natsWrapper')

it('cancelled order', async () => {
  // create ticket 
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100
  });
  await ticket.save();
  // create user 
  const user = global.getcookie();
  // create order
  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // console.log(order.body)
  // cancel order
  await request(app)
    .delete(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .expect(204)

  const updatedOrder = await Order.findById(order.body.id);
  // console.log(updatedOrder)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})


it('return status 400 for invalid ticket id', async () => {
  const user = global.getcookie();
  await request(app)
    .delete(`/api/orders/dsffdscaa`)
    .set('Cookie', user)
    .expect(400)





})
it("return 401 for unauthorized user", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100
  });
  await ticket.save();

  const user = global.getcookie();
  const user2 = global.getcookie();

  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.body.id}`)
    .set('Cookie', user2)
    .expect(401)
})

it('emit event when order cancelled', async () => {

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100,

  });
  await ticket.save();
  // create user 
  const user = global.getcookie();
  // create order
  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // console.log(order.body)

  // cancel order
  await request(app)
    .delete(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .expect(204)

  const updatedOrder = await Order.findById(order.body.id);
  // console.log(updatedOrder)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})