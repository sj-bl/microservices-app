import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@sj-bl/common';
import mongoose from 'mongoose'
import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';

import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
import { natsWrapper } from '../natsWrapper';
import { Ticket } from '../models/ticket';



const router = express.Router();

router.delete('/api/orders/:id', [
  param('id')
    .custom((id: string): boolean => mongoose.isValidObjectId(id))
    .withMessage('Invalid Ticket ID')
],
  requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save()
    new OrderCancelledPublisher(natsWrapper.client)
      .publish({
        id: order.id,
        version: order.version,

        ticket: {
          id: order.ticket.id
        }
      })
    res.status(204).send(order)
  });



export { router as deleteOrderRouter }