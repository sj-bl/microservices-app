import request from 'supertest';

import { app } from '../../app'

const createTicket = async () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.getcookie())
    .send({ title: 'T1', price: 10, userId: '5f426dab0949de0018b6ad8c' })
    .expect(201);
}

it('return 200 get all tickets', async () => {

  await createTicket();
  await createTicket();
  await createTicket();
  const res = await request(app).get(`/api/tickets`).send().expect(200);
  // console.log(res.body);
  expect(200);
})
