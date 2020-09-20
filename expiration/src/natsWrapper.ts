import nats, { Stan } from 'node-nats-streaming';


class NatsWrapper {
  private _client?: Stan;
  get client() {
    if (!this._client) {
      throw new Error('can not intialize client before connecting to nats')
    }
    return this._client
  }
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url: url });
    return new Promise((resolve, reject) => {

      this.client.on('connect', () => {
        console.log('Connected To nats');
        // @ts-ignoress
        resolve();
      })
      this.client.on('err', (err) => {
        reject(err)
      })
    })
  }
}


export const natsWrapper = new NatsWrapper()



