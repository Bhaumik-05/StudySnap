import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN"],
      default: "STUDENT",
    },

    sem: {
      type: Number,
      min: 1,
      max: 8,
      required: function () {
        return (this.role !== "ADMIN" && this.role !== "FACULTY");
        },
    },

    mobile: {
      type: String,
      trim: true,
    },

    deptId: {
        type: Number,
        required: function () {
        return this.role !== "ADMIN";
        },
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;