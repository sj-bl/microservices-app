import express from "express";
import { json } from "body-parser";
import "express-async-errors";

import cookieSession from "cookie-session";


import { currentUser, errorHandler } from "@sj-bl/common";
import { NotFoundError } from "@sj-bl/common";
import { CreateTicketRouter } from "./routes/new";
import { showRouter } from "./routes/show";
import { indexRouter } from "./routes";
import { updateRouter } from "./routes/update";

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

app.use(CreateTicketRouter)
app.use(showRouter)
app.use(indexRouter)
app.use(updateRouter)
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
