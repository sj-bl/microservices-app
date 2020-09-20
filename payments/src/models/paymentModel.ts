import mongoose from "mongoose";


interface PaymentsAttrs {
  orderId: string;
  stripeId: string;
}
interface PaymentsDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentsModel extends mongoose.Model<PaymentsDoc> {
  build(attrs: PaymentsAttrs): PaymentsDoc
}
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id
    }
  }
})

paymentSchema.statics.build = (attrs: PaymentsAttrs): PaymentsDoc => {
  return new Payment(attrs)
}

const Payment = mongoose.model<PaymentsDoc, PaymentsModel>('Payments', paymentSchema)

export { Payment }