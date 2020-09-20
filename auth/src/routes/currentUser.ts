import express from "express";

// import { requireAuth } from "@sj-bl/common";
import { currentUser } from "@sj-bl/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});
export { router as currentuserRouter };
