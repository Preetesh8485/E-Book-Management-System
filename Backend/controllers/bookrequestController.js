import { catchAsynError } from "../middlewear/CatchAsyncErrors.js";
import { io, connectedUsers } from "../server.js";
import ErrorHandler from "../middlewear/errorMiddlewear.js";
import { BookRequest } from "../Models/bookRequestModel.js";
import { Book } from "../Models/bookModel.js";
import { Borrow } from "../Models/borrowModel.js";
import User from "../Models/UserModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { borrowTemplate } from "../utils/emailTemplates.js";
import { requestRejectedTemplate } from "../utils/emailTemplates.js";

export const createBookRequest = catchAsynError(async (req, res, next) => {
  const { book } = req.body;

  if (!book) return next(new ErrorHandler("Book ID is required", 400));

  const existingBook = await Book.findById(book);
  if (!existingBook) return next(new ErrorHandler("Book not found", 404));

  const existingRequest = await BookRequest.findOne({
    user: req.user._id,
    book,
    status: "Pending",
  });
  if (existingRequest) {
    return next(new ErrorHandler("You already have a pending request for this book", 400));
  }

  const user = await User.findById(req.user._id);
  const alreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === book && b.returned === false
  );
  if (alreadyBorrowed) {
    return next(new ErrorHandler("You already have this book borrowed", 400));
  }

  await BookRequest.create({ user: req.user._id, book });

  // Populate for socket payload so admin sees full details immediately
  const populated = await BookRequest.findOne({ user: req.user._id, book, status: "Pending" })
    .populate("user", "name email regdno")
    .populate("book");

  // Emit to all connected admins
  io.to("admins").emit("newBookRequest", populated);

  res.status(201).json({
    success: true,
    message: "Book request submitted successfully",
  });
});

// Admin: get all requests
export const getAllBookRequests = catchAsynError(async (req, res) => {
  const requests = await BookRequest.find()
    .populate("user", "name email regdno")
    .populate("book")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, requests });
});

// Member: get my own requests
export const getMyBookRequests = catchAsynError(async (req, res) => {
  const requests = await BookRequest.find({ user: req.user._id })
    .populate("book")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, requests });
});

// Admin: approve → directly issues the book
export const approveBookRequest = catchAsynError(async (req, res, next) => {
  const request = await BookRequest.findById(req.params.id)
    .populate("user")
    .populate("book");

  if (!request) return next(new ErrorHandler("Request not found", 404));
  if (request.status !== "Pending") return next(new ErrorHandler("Request already processed", 400));

  const book = request.book;
  const user = request.user;

  if (book.quantity === 0) return next(new ErrorHandler("Book is out of stock", 400));

  const alreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === book._id.toString() && b.returned === false
  );
  if (alreadyBorrowed) return next(new ErrorHandler("User already has this book borrowed", 400));

  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  user.borrowedBooks.push({
    bookId: book._id,
    BookTitle: book.title,
    borrowedDate: new Date(),
    dueDate,
  });
  await user.save();

  await Borrow.create({
    user: { id: user._id, name: user.name, email: user.email, regdno: user.regdno },
    book: book._id,
    dueDate,
    price: book.price,
  });

  request.status = "Approved";
  await request.save();

  const message = borrowTemplate(user.name, book.title, dueDate);
  await sendEmail({ email: user.email, subject: "📚 Book Issued Successfully", message });

  // Notify the specific member via their socket
  const memberSocketId = connectedUsers.get(user._id.toString());
  if (memberSocketId) {
    io.to(memberSocketId).emit("requestApproved", {
      bookTitle: book.title,
      dueDate,
      message: `Your request for "${book.title}" was approved! Due: ${new Date(dueDate).toDateString()}`,
    });
  }

  res.status(200).json({
    success: true,
    message: `"${book.title}" issued to ${user.name} successfully`,
  });
});



// Admin: reject request


export const rejectBookRequest = catchAsynError(async (req, res, next) => {
  const request = await BookRequest.findById(req.params.id)
    .populate("user")
    .populate("book");

  if (!request) return next(new ErrorHandler("Request not found", 404));
  if (request.status !== "Pending") return next(new ErrorHandler("Request already processed", 400));

  request.status = "Rejected";
  await request.save();

  // Email the member
  const message = requestRejectedTemplate(request.user.name, request.book?.title);
  await sendEmail({
    email: request.user.email,
    subject: "❌ Book Request Rejected - Library Notice",
    message,
  });

  // Socket — notify if online
  const memberSocketId = connectedUsers.get(request.user._id.toString());
  if (memberSocketId) {
    io.to(memberSocketId).emit("requestRejected", {
      bookTitle: request.book?.title,
      message: `Your request for "${request.book?.title}" was rejected.`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Request rejected successfully",
  });
});