import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import InvalidToken from "../models/InvalidToken.js";

export const registerUser = async (req, res) => {
  let success = false;
  try {
    const { name, username, bio, age, password } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success, error: "User with credentials already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user = await User.create({
      name,
      username,
      bio,
      age,
      password: hashedPassword,
    });

    const data = {
      user: {
        id: user._id,
        name: user.name,
      },
    };
    const authtoken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    res.json({ Message: "Account create successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
export const loginUser = async (req, res) => {
  let success = false;
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success, errors: "Please enter correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({
        success,
        error: "Please try to login with correct credentials",
      });
    }

    const data = {
      user: {
        id: user._id,
        name: user.name,
      },
    };
    success = true;
    const authtoken = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ authtoken, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const detailsUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const userid = req.user.id;
    const { name, username, bio, age } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userid.toString()) {
      return res.status(400).json({ message: "Username is already taken." });
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      name,
      username,
      bio,
      age,
    });
    return res.json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logoutUser = async (req, res) => {
  try {
    const token = req.header("auth-token");
    const userId = req.user.id;
    await InvalidToken.create({ userId, token });
    return res.json({ message: "User logged out successfully." });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error logging out.", error });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
