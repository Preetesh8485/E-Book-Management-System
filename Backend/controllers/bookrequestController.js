import { BookRequest } from "../Models/bookRequestModel.js";
import { Book } from "../Models/bookModel.js";
import User from "../Models/UserModel.js";
import { borrowTemplate } from "../utils/emailTemplates.js";
import { Borrow } from "../Models/borrowModel.js";
import { catchAsynError } from "../middlewear/CatchAsyncErrors.js";
import ErrorHandler from "../middlewear/errorMiddlewear.js";
import { sendEmail } from "../utils/sendEmail.js";
export const requestBook = catchAsynError(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book out of stock", 400));
  }

  const alreadyRequested = await BookRequest.findOne({
    "user.id": req.user._id,
    book: id,
    status: "Pending",
  });

  if (alreadyRequested) {
    return next(new ErrorHandler("Request already pending", 400));
  }

  const alreadyBorrowed = req.user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );

  if (alreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed", 400));
  }

  await BookRequest.create({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      regdno: req.user.regdno,
    },
    book: id,
  });

  res.status(200).json({
    success: true,
    message: "Book request sent successfully",
  });
});
export const getAllRequests = catchAsynError(async (req, res, next) => {
  const requests = await BookRequest.find()
    .populate("book")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    requests,
  });
});
export const approveRequest = catchAsynError(async (req, res, next) => {
  const { requestId } = req.params;
  const request = await BookRequest.findById(requestId).populate("book");
  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }
  if (request.status !== "Pending") {
    return next(new ErrorHandler("Request already processed", 400));
  }
  const user = await User.findById(request.user.id);
  const book = await Book.findById(request.book._id);
  if (book.quantity === 0) {
    return next(new ErrorHandler("Book out of stock", 400));
  }
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();
  user.borrowedBooks.push({
    bookId: book._id,
    BookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();
  const borrow = await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      regdno: user.regdno,
    },
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });
  request.status = "Approved";
  await request.save();
  const message = borrowTemplate(
    user.name,
    book.title,
    borrow.dueDate
  );

  await sendEmail({
    email: user.email,
    subject: "Book Request Approved",
    message,
  });

  res.status(200).json({
    success: true,
    message: "Request approved successfully",
  });
});

export const rejectRequest = catchAsynError(async (req, res, next) => {
  const { requestId } = req.params;

  const request = await BookRequest.findById(requestId);

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (request.status !== "Pending") {
    return next(new ErrorHandler("Request already processed", 400));
  }
  request.status = "Rejected";
  await request.save();
  res.status(200).json({
    success: true,
    message: "Request rejected successfully",
  });
});