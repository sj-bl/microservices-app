import moongoose, { Mongoose } from 'mongoose';
import { OrderStatus } from '@sj-bl/common'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;

}


interface OrderDoc extends moongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends moongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}



const orderschema = new moongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created

  },
  expiresAt: {
    type: moongoose.Schema.Types.Date
  },
  ticket: {
    type: moongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  },

}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id,
        delete ret._id
    }
  }
})

orderschema.set('versionKey', 'version');
orderschema.plugin(updateIfCurrentPlugin);

orderschema.statics.build = (attr: OrderAttrs) => {
  return new Order(attr);
}

export const Order = moongoose.model<OrderDoc, OrderModel>("Order", orderschema)