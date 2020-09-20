import { rejects } from 'assert';
import { Stan } from 'node-nats-streaming'
import { Subjects } from './Subjects';



interface Events {
  subject: Subjects;
  data: any
}

export abstract class Publisher<T extends Events>{
  abstract subject: T['subject'];
  private client: Stan
  constructor(client: Stan) {
    this.client = client;
  }
  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        console.log('Event publish')
        if (err) {
          rejects()
        }
        resolve();
      })
    })
  }
}