import { PaymentCreated, Publisher, Subjects } from "@sj-bl/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreated> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
