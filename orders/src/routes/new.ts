import { BadRequestError, NotFoundError, OrderStatus, requireAuth } from '@sj-bl/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import moongoose, { version } from 'mongoose'

import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../natsWrapper';


const router = express.Router();
// #################################################
const EXPIRATION_WINDOW_SECONDS = 0.5 * 60
// #################################################

router.post('/api/orders',
  requireAuth,
  [
    body('tickeId')
      .not()
      .isEmpty()
      .custom((input: string) => moongoose.isValidObjectId(input))
      .withMessage('ticket id must be provided')
  ], async (req: Request, res: Response) => {

    const { ticketId } = req.body;
    // Fetch ticket from database
    const ticket = await Ticket.findById(ticketId).populate('ticket');
    if (!ticket) {

      throw new NotFoundError();
    }
    // Check if this ticket is not already reserved 
    // Run query to look all orders find where the ticket 
    // is same as we just ###found###  
    // check ticket status is ###not### cancelled
    // if we find ticket it means ticket is reseerved
    // isreserved is method to Ticket model which returns ""true"" 
    // if ticket is reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    const order = Order.build({
      ticket,
      userId: req.currentUser!.id,
      expiresAt: expiration,
      status: OrderStatus.Created,
    });
    await order.save()
    new OrderCreatedPublisher(natsWrapper.client)
      .publish(
        {
          id: order.id,
          status: order.status,
          version: order.version,
          userId: order.userId,
          expiresAt: order.expiresAt.toISOString(),
          ticket: {
            id: ticket.id,
            price: ticket.price,
          }
        });
    res.status(201).send(order)
  });

export { router as createOrderRouter }