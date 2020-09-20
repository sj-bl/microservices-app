import { OrderCreatedEvent, Publisher, Subjects } from "@sj-bl/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}