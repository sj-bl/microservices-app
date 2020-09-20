import { OrderCancelledEvent, Publisher, Subjects } from "@sj-bl/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}