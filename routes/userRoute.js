import express from "express";
import {
  deleteUser,
  detailsUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from "../controller/userController.js";
import { fetchuser } from "../middleware/fetchuser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/details",fetchuser, detailsUser);
router.put("/update",fetchuser, updateUser);
router.delete("/delete",fetchuser, deleteUser);
router.post("/logout",fetchuser, logoutUser);
router.post("/resetPassword",fetchuser, resetPassword);

export default router;
