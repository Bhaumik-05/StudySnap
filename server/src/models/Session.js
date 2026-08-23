import mongoose from "mongoose";

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session = model("Session", sessionSchema);

export default Session;