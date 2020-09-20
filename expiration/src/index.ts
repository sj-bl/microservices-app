import { OrderCreatedListener } from "./events/orderCreatedListener";
import { natsWrapper } from "./natsWrapper";

const startServer = async () => {
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID not defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID not defined");
  }
  try {
    // #######################
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

    // TERMINATED PROGRAM IF CLIENT DISCONNECTED TO NATS
    natsWrapper.client.on('close', () => {
      console.log('connected to nats'); process.exit();
    })
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGNTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen()

  } catch (error) {
    console.log(error);
  }
};

startServer();






