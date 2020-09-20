import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../natsWrapper';

jest.mock('../../natsWrapper.ts')

it('route handler => /api/tickets/  |  with type => POST ', async () => {
  const res = await request(app).post('/api/tickets').send({});
  expect(res.status).not.toEqual(404);

})
it('return 401 if user is not signed in ', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
})
it('returns other than 401 if user is signed in', async () => {

  const res = await request(app).post('/api/tickets').set('Cookie', global.getcookie()).send({});
  expect(res.status).not.toEqual(401);
})
it('Error => if inavlid title ', async () => {
  await request(app).post('/api/tickets').set('Cookie', global.getcookie()).send({ title: '', price: 100 }).expect(400);
  await request(app).post('/api/tickets').set('Cookie', global.getcookie()).send({ price: 100 }).expect(400);
})
it('Error => if inavlid price ', async () => {
  await request(app).post('/api/tickets').set('Cookie', global.getcookie()).send({ title: 'asdfghjkl', price: -1 }).expect(400);
  await request(app).post('/api/tickets').set('Cookie', global.getcookie()).send({ title: 'asdfghjk', }).expect(400);
})
it('create ticket for valid input', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getcookie())
    .send({ title: 'sdfghjkl', price: 100 })
    .expect(201)

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
})

it('publish event after ticket creation', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getcookie())
    .send({ title: 'sdfghjkl', price: 100 })
    .expect(201)

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})