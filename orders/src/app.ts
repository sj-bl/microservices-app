import express from "express";
import { json } from "body-parser";
import "express-async-errors";

import cookieSession from "cookie-session";


import { currentUser, errorHandler } from "@sj-bl/common";
import { NotFoundError } from "@sj-bl/common";
import { indexOrderRouter } from "./routes/index";
import { showOrderRouter } from "./routes/show";
import { createOrderRouter } from "./routes/new";
import { deleteOrderRouter } from "./routes/delete";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.Node_ENV !== "test",
  })
);
app.use(currentUser)

app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
