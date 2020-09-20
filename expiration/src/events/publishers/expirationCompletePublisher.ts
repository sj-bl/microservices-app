import { ExpirationCompleteEvent, Publisher, Subjects } from "@sj-bl/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
