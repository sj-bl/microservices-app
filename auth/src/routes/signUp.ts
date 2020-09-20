import express, { Response, Request } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "@sj-bl/common";
import jwt from "jsonwebtoken";
import { DatabaseConnectionError } from "@sj-bl/common";
import { User } from "../models/user-schema";
import { BadRequestError } from "@sj-bl/common";
import { validateRequest } from "@sj-bl/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Please provide valid email"),
    body("password")
      .trim()
      .isLength({ max: 20, min: 4 })
      .withMessage("Password must be between 4 o 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const isExistingUser = await User.findOne({ email });

    if (isExistingUser) {
      throw new BadRequestError("Email already in use!");
    }
    const user = await User.create({ email, password });

    // CREATE JSON WEB TOKEN
    const userJWt = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJWt };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
