import request from 'supertest';
import { Ticket } from '../../models/tickets';
import { app } from '../../app'

it('return 200 if ticket found', async () => {
  const { body: { title, id, price } } = await request(app).post('/api/tickets').set('Cookie', global.getcookie()).send({ title: 'asdfghjkl', price: 10, userId: '5f426dab0949de0018b6ad8c' }).expect(201);


  expect(title).toEqual('asdfghjkl');
  expect(price).toEqual(10);
  expect(200)
})
it('return 404 if ticket not found', async () => {

  return request(app).get(`/api/tickets/asdfghjkkjhgfds`).send().expect(404)
})

