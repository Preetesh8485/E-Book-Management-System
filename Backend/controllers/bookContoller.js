import express from "express"
import { catchAsynError } from "../middlewear/CatchAsyncErrors.js"
import { Book } from "../Models/bookModel.js"
import { OrderList } from "../Models/bookOrder.js"
import ErrorHandler from "../middlewear/errorMiddlewear.js"
export const addBook = catchAsynError(async (req, res, next) => {
    let { title, author, ISBN, description, location, price, quantity } = req.body;

    if (!title || !author || !ISBN || !location || !description || price === undefined || quantity === undefined) {
        return next(new ErrorHandler("Enter all fields", 400));
    }
    ISBN = ISBN.replace(/-/g, "").trim();
    if (!/^\d{10}(\d{3})?$/.test(ISBN)) {
        return next(new ErrorHandler("Invalid ISBN format", 400));
    }
    if (price < 0 || quantity < 0) {
        return next(new ErrorHandler("Price and quantity must be non-negative", 400));
    }
    const existingBook = await Book.findOne({ ISBN });

    if (existingBook) {
        return next(new ErrorHandler("ISBN already exists", 400));
    }

    try {
        const book = await Book.create({
            title,
            author,
            ISBN,
            description,
            location,
            price,
            quantity,
        });

        res.status(201).json({
            success: true,
            message: "Book added to library successfully",
            book,
        });

    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.ISBN) {
            return next(new ErrorHandler("ISBN already exists", 400));
        }
        return next(error);
    }
})
export const DeleteBook = catchAsynError(async (req, res, next) => {
    const {id}=req.params;
    const book=await Book.findById(id);
    if(!book){
        return next(new ErrorHandler("Book not found",404));
    }
    await book.deleteOne();
     res.status(200).json({
        success:true,
        message:`${book} removed from library successfully`
    })
})
export const showBook = catchAsynError(async (req, res, next) => {
    const books= await Book.find();
    res.status(200).json({
        success:true,
        books
    })
})







export const createOrder = catchAsynError(async (req, res, next) => {
    const { title, author, ISBN, seller,invoiceID, quantity } = req.body;
    if (
        !title ||
        !author ||
        !ISBN ||
        !seller ||
        !invoiceID||
        quantity === undefined
    ) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    if (quantity <= 0) {
        return next(new ErrorHandler("Quantity must be greater than 0", 400));
    }
    const normalizedISBN = ISBN.replace(/-/g, "").trim();
    const order = await OrderList.create({
        title,
        author,
        ISBN: normalizedISBN,
        seller,
        invoiceID,
        quantity
    });
    res.status(201).json({
        success: true,
        message: "Order placed successfully (pending delivery)",
        order
    });
});
export const markOrderDelivered = catchAsynError(async (req, res, next) => {
    const order = await OrderList.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }
    if (order.OrderDelivery === "Delivered") {
        return next(new ErrorHandler("Order already delivered", 400));
    }

    order.OrderDelivery = "Delivered";
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order marked as delivered",
        order
    });
});
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderList.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};