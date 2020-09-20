import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@sj-bl/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketUpdatedPublisher } from "../events/publisher/ticketUpdatedPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();
router.put('/api/tickets/:id', requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is require'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be provided and must be greater than 0'),

  ], validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
      throw new NotFoundError()
    }
    const { userId } = ticket;
    // console.log({ userId, currentUser: req.currentUser!.id });

    if (ticket.orderId) {
      throw new BadRequestError('Ticket is reserved')
    }

    if (userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    const { title, price } = req.body;
    ticket.set({ title, price })
    const updatedTicket = await ticket.save()
    // console.log({ updatedTicket })
    res.send({ ticket: updatedTicket })

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version
    })
  });


export { router as updateRouter }