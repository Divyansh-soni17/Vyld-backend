import mongoose from "mongoose";
const { Schema } = mongoose;

const invalidTokenschema = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
});

const InvalidToken = mongoose.model("InvalidToken", invalidTokenschema);
export default InvalidToken;
