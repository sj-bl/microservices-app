import moongoose, { Mongoose } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';


interface TicketAttrs {
  id: string;
  title: string;
  price: number
}

export interface TicketDoc extends moongoose.Document {
  id: string;
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;

}



const ticketSchema = new moongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id
      }
    }
  })
interface TicketModel extends moongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attr: TicketAttrs) => {
  return new Ticket({
    _id: attr.id,
    title: attr.title,
    price: attr.price
  })
}

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in:
        [
          OrderStatus.AwaitingPayments,
          OrderStatus.Complete,
          OrderStatus.Created,
        ]
    }
  })
  return !!existingOrder
}


const Ticket = moongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)


export { Ticket }