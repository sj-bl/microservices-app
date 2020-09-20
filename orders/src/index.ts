import mongoose from "mongoose";
import { app } from "./app";
import { ExpirationCompleteListener } from "./events/listener/expirationCompleteListener";
import { PaymentCreatedListener } from "./events/listener/paymentCreatedListener";
import { TicketCreatedListner } from "./events/listener/ticketCreatedListener";
import { TicketUpdatedListener } from "./events/listener/ticketUpdatedListener";
import { natsWrapper } from "./natsWrapper";

const startServer = async () => {
  console.log("Starting server...")
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
      console.log('connected to nats');
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGNTERM', () => natsWrapper.client.close())

    new PaymentCreatedListener(natsWrapper.client).listen()
    new TicketCreatedListner(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Auth Database Connected Successfully");
  } catch (error) {
    console.log(error);
  } finally {
    app.listen(3000, () => {
      console.log("running on port 3000");
    });
  }
};

startServer();




