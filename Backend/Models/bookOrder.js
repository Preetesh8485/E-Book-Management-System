import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    },

    title: { type: String, trim: true },
    ISBN: { type: String, trim: true },
    author: { type: String, trim: true },

    seller: {
        type: String,
        required: true,
        trim: true
    },
    invoiceID:{
        type: String,
        required: true,
        trim: true
    }
    ,
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
    },
    OrderDelivery:{
    type: String,
    enum: ["Pending", "Delivered"],
    default: "Pending"
}
}, {
    timestamps: true
});

export const OrderList = mongoose.model("OrderList", orderSchema);