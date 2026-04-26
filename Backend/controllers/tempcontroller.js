import { v2 as cloudinary } from "cloudinary";
import { catchAsynError } from "../middlewear/CatchAsyncErrors.js";
import ErrorHandler from "../middlewear/errorMiddlewear.js";
import { Book } from "../Models/bookModel.js";

export const updateBookImage = catchAsynError(async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }

    // require image
    if (!req.files || !req.files.image) {
        return next(new ErrorHandler("Image required", 400));
    }

    const file = req.files.image;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "library_books"
    });

    book.image = {
        public_id: result.public_id,
        url: result.secure_url
    };

    await book.save();

    res.status(200).json({
        success: true,
        message: "Image updated",
        book
    });
});

