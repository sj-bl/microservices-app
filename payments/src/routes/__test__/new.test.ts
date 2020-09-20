import { OrderStatus } from "@sj-bl/common"
import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/orderModel"
import { Payment } from "../../models/paymentModel"
import { stripe } from "../../stripe";

// jest.mock('../../stripe')

it('return 404 if user try to purchase', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getcookie())
    .send({ orderId: mongoose.Types.ObjectId().toHexString(), token: 'asdfghjk' })
    .expect(404)
})

it('return a 401 when purchasing an order that doesnt belong to user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 100
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getcookie())
    .send({ orderId: order.id, token: 'asdfghjk' })
    .expect(401)
})
it('return a 400 if pay for cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    userId,
    version: 0,
    price: 100
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getcookie(userId))
    .send({ orderId: order.id, token: 'asdfghjk' })
    .expect(400)
})
it('return a 201 for valid request', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 10000)
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId,
    version: 0,
    price
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getcookie(userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201)
  const paymentList = await stripe.charges.list({ limit: 50 });

  const payment = paymentList.data.find(payment => payment.amount === price * 100)

  expect(payment).toBeDefined()
  expect(payment!.currency).toEqual('inr')


  const paymentDoc = await Payment.findOne({
    orderId: order.id,
    stripeId: payment!.id
  })

  expect(payment).not.toBeNull()

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(chargeOptions.source).toEqual('tok_visa')
  // expect(chargeOptions.amount).toEqual(order.price * 100)
  // expect(chargeOptions.currency).toEqual('inr')
})

