import nats, { Message, Stan } from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from './events/ticketCreatedListener'
console.clear()

const stan = nats.connect('ticketing', randomBytes(8).toString('hex'), {
  url: 'http://localhost:4222'
});
stan.on('connect', () => {
  console.log('Listner connected ')
  stan.on('close', () => process.exit())
  new TicketCreatedListener(stan).listen()
})



process.on('SIGNT', () => stan.close());
process.on('SIGNT', () => stan.close());




