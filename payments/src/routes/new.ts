import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sj-bl/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { stripe } from '../stripe'
import { Order } from '../models/orderModel'
import { Payment } from '../models/paymentModel'
import { PaymentCreatedPublisher } from '../events/publisher/paymentCreatedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

router.post('/api/payments',
  requireAuth,
  [
    body('orderId').notEmpty(),
    body('token').notEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('can not pay for cancelled order')
    }

    const charge = await stripe.charges.create({
      currency: 'inr',
      amount: order.price * 100,
      source: token
    })

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    })
    await payment.save()

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })
    res.status(201).send({ id: payment.id })
  })



export { router as createChargeRouter }