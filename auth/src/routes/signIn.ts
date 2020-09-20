import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user-schema";
import { BadRequestError } from "@sj-bl/common";
import { PassWord } from "../services/password";
import { validateRequest } from "@sj-bl/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Please Provide Valid Email"),
    body("password").trim().notEmpty().withMessage("Please Provide Password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }
    const isValidPassword = await PassWord.compare(user.password, password);
    if (!isValidPassword) {
      throw new BadRequestError("Invalid email or password");
    }
    const userJWt = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJWt };
    res.status(200).send(user);
  }
);
export { router as signinRouter };
