import express from "express";
import { json } from "body-parser";
import "express-async-errors";

import cookieSession from "cookie-session";

import { currentuserRouter } from "./routes/currentUser";
import { signupRouter } from "./routes/signUp";
import { signinRouter } from "./routes/signIn";
import { signoutRouter } from "./routes/signOut";
import { errorHandler } from "@sj-bl/common";
import { NotFoundError } from "@sj-bl/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.Node_ENV !== "test",
  })
);

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
