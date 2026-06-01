import mongoose from "mongoose";
const bookRequestSchema=new mongoose.Schema({
     user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: String,
      email: String,
      regdno: Number,
    },
     book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const BookRequest = mongoose.model("BookRequest",bookRequestSchema);