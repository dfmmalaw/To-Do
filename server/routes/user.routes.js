import express from "express";
const router = express.Router();
import { protect } from "../middlewares/auth.js";
import {
  readController,
  updatePasswordController,
} from "../controllers/user.controller.js";

router
  .route("/user/:id")
  .all(protect)
  .get(readController)
  .put(updatePasswordController);
// router.put('/admin/update', protect, adminMiddleware, updatePasswordController);

export default router;
