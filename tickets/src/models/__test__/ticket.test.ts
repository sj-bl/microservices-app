import { Ticket } from "../tickets"

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: 'asdd132easdaadaas'
  })
  await ticket.save();

  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  firstTicket!.set({ price: 10 });
  secondTicket!.set({ price: 10 });

  await firstTicket!.save();

  try {
    await secondTicket!.save();

  } catch (error) {
    return done()
  }
  throw new Error('should not reach this point')

})

it('increment version number on multiple save', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: 'asdd132easdaadaas'
  })
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
})