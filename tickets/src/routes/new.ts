import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from '@sj-bl/common';
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher, } from "../events/publisher/ticketCreatedPublisher";
import { natsWrapper } from "../natsWrapper";
import { version } from "mongoose";



const router = express.Router();

router.post('/api/tickets', requireAuth, [body('title').not().isEmpty().withMessage('Title is require'), body('price').not().isEmpty().withMessage('price is require'), body('price').isFloat({ gt: 0 })], validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });

  await ticket.save();
  res.status(201).send(ticket)
  new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    userId: ticket.userId,
    price: ticket.price,
    title: ticket.title,
    version: ticket.version
  })
});
export { router as CreateTicketRouter }