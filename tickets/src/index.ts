import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancenlledListener } from "./events/listener/orderCancelledEvent";
import { OrderCreatedListener } from "./events/listener/orderCreatedListener";
import { natsWrapper } from "./natsWrapper";

const startServer = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }
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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancenlledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("ticket Database Connected Successfully");
  } catch (error) {
    console.log(error);
  } finally {
    app.listen(3000, () => {
      console.log("running on port 3000");
    });
  }
};

startServer();




