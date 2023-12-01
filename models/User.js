import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  username: {
    type: String,
    required: [true, "Please enter your name"],
    unique: true,
  },
  bio: {
    type: String,
    required: [true, "Please enter about yourself"],
  },
  age: {
    type: Number,
    required: [true, "Please enter your agee"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
