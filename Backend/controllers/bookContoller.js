import express from "express"
import { catchAsynError } from "../middlewear/CatchAsyncErrors.js"
import { Book } from "../Models/bookModel.js"
import { OrderList } from "../Models/bookOrder.js"
import ErrorHandler from "../middlewear/errorMiddlewear.js"
import cloudinary from "../utils/cloudinary.js"
import { GoogleGenerativeAI } from "@google/generative-ai";
export const addBook = catchAsynError(async (req, res, next) => {
    let {
        title,
        author,
        ISBN,
        description,
        location,
        price,
        quantity,

        genre,
        tags,
        moodTags,
        difficultyLevel,
        language,
        publishYear,
        aiSummary,
        criticSummary,
    } = req.body;

    if (
        !title ||
        !author ||
        !ISBN ||
        !location ||
        !description ||
        price === undefined ||
        quantity === undefined
    ) {
        return next(
            new ErrorHandler("Enter all required fields", 400)
        );
    }

    ISBN = ISBN.replace(/-/g, "").trim();

    if (!/^\d{10}(\d{3})?$/.test(ISBN)) {
        return next(
            new ErrorHandler("Invalid ISBN format", 400)
        );
    }

    if (price < 0 || quantity < 0) {
        return next(
            new ErrorHandler(
                "Price and quantity must be non-negative",
                400
            )
        );
    }

    const existingBook = await Book.findOne({ ISBN });

    if (existingBook) {
        return next(
            new ErrorHandler("ISBN already exists", 400)
        );
    }

    if (!req.file) {
        return next(
            new ErrorHandler(
                "Book image is required",
                400
            )
        );
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
    )}`;

    const cloudinaryResponse =
        await cloudinary.uploader.upload(base64, {
            folder: "LIBRARY_BOOKS",
            quality: "auto",
            fetch_format: "auto",
            transformation: [
                {
                    width: 500,
                    crop: "limit",
                },
            ],
        });

    try {
        try {
            genre =
                typeof genre === "string"
                    ? JSON.parse(genre)
                    : genre || [];

            tags =
                typeof tags === "string"
                    ? JSON.parse(tags)
                    : tags || [];

            moodTags =
                typeof moodTags === "string"
                    ? JSON.parse(moodTags)
                    : moodTags || [];
        } catch {
            return next(
                new ErrorHandler(
                    "Invalid metadata format",
                    400
                )
            );
        }
        const book = await Book.create({
            title,
            author,
            ISBN,
            description,
            location,
            price,
            quantity,

            genre,
            tags,
            moodTags,

            difficultyLevel,
            language,
            publishYear,
            aiSummary,
            criticSummary,

            image: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
        });
        return res.status(201).json({
            success: true,
            message:
                "Book added to library successfully",
            book,
        });
    } catch (error) {
        if (
            error.code === 11000 &&
            error.keyPattern?.ISBN
        ) {
            return next(
                new ErrorHandler(
                    "ISBN already exists",
                    400
                )
            );
        }

        return next(error);
    }
});
export const DeleteBook = catchAsynError(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
    if (book.image?.public_id) {

        await cloudinary.uploader.destroy(
            book.image.public_id
        );
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: `${book.title} removed from library successfully`
    })
})
export const showBook = catchAsynError(async (req, res, next) => {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books
    })
})







export const createOrder = catchAsynError(async (req, res, next) => {
    const { title, author, ISBN, seller, invoiceID, quantity } = req.body;
    if (
        !title ||
        !author ||
        !ISBN ||
        !seller ||
        !invoiceID ||
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
export const deleteOrder = catchAsynError(async (req, res, next) => {

    const order = await OrderList.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});
const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

export const generateBookMetadata =
    catchAsynError(async (req, res, next) => {

        const {
            title,
            author,
            description,
        } = req.body;

        if (
            !title ||
            !author ||
            !description
        ) {
            return next(
                new ErrorHandler(
                    "Title, author and description are required",
                    400
                )
            );
        }

        const prompt = `
You are a professional librarian.

Analyze the following book and return ONLY valid JSON.

Title:
${title}

Author:
${author}

Description:
${description}

Rules:

1. genre must contain 1-3 genres.
2. tags must contain 5-10 useful search keywords.
3. moodTags must be chosen from:
   ["Happy","Sad","Motivated","Stressed","Relaxed","Curious"].
4. difficultyLevel must be:
   Beginner, Intermediate, or Advanced.
5. aiSummary should be under 60 words.
6. criticSummary should be under 60 words.
7. Output JSON only.

{
  "genre": [],
  "tags": [],
  "moodTags": [],
  "difficultyLevel": "",
  "language": "English",
  "publishYear": null,
  "aiSummary": "",
  "criticSummary": ""
}
`;

        let result;

        try {
            result = await Promise.race([
                model.generateContent(prompt),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("AI timeout")),
                        10000
                    )
                )
            ]);
        } catch (error) {
            return next(
                new ErrorHandler(
                    "AI service unavailable. Please try again.",
                    503
                )
            );
        }

        let response =
            result.response.text();

        response = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const start = response.indexOf("{");
        const end = response.lastIndexOf("}");

        response = response.slice(
            start,
            end + 1
        );

        let metadata;

        try {
            metadata = JSON.parse(response);
            if (
                !Array.isArray(metadata.genre) ||
                !Array.isArray(metadata.tags) ||
                !Array.isArray(metadata.moodTags)
            ) {
                return next(
                    new ErrorHandler(
                        "Invalid AI response structure",
                        500
                    )
                );
            }
        } catch {
            return next(
                new ErrorHandler(
                    "AI returned invalid data",
                    500
                )
            );
        }

        return res.status(200).json({
            success: true,
            metadata,
        });
    });