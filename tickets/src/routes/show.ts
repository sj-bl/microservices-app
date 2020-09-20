import { NotFoundError } from '@sj-bl/common';
import express, { Response, Request } from 'express';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id)

  try {
    const ticket = await Ticket.findById(id);
    res.status(200).send(ticket)
  } catch (error) {
    throw new NotFoundError();
  }
});

export { router as showRouter }