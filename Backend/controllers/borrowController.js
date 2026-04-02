import {catchAsynError} from "../middlewear/CatchAsyncErrors.js"
import ErrorHandler from "../middlewear/errorMiddlewear.js"
import { Book } from "../Models/bookModel.js";
import {Borrow} from "../Models/borrowModel.js"
import User from "../Models/UserModel.js";
import { calculateFine } from "../utils/finecalculate.js";
import { sendEmail } from "../utils/sendEmail.js";
import { borrowTemplate } from "../utils/emailTemplates.js";
export const recordBorrowedBooks = catchAsynError(async(req,res,next)=>{
const {id}=req.params;
 const {email}=req.body;
 const book = await Book.findById(id);
 if(!book){
    return next(new ErrorHandler("Book not found",404));
 }
 const user= await User.findOne({
    email,role:"Member",Accountverification:true
 })
 if(!user){
    return next(new ErrorHandler("User not registered",400));
 }
 if(book.quantity===0){
    return next(new ErrorHandler("Book is out of stock",400));
 }
 const isAlreadyBorrowed = user.borrowedBooks.find((b)=> b.bookId.toString()===id && b.returned===false)
 if(isAlreadyBorrowed){ return next(new ErrorHandler("Book is already borrowed",400));}
 book.quantity-=1;
 book.availability=book.quantity>0;
 await book.save();
 user.borrowedBooks.push({
    bookId:book._id,
    BookTitle:book.title,
    borrowedDate:new Date(),
    dueDate: new Date(Date.now()+7*24*60*60*1000)
 })
 await user.save();
 
 const borrow=await Borrow.create({
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        regdno:user.regdno
    },
    book:book._id,
    dueDate:new Date(Date.now()+7*24*60*60*1000),
    price:book.price,
 })
 const message = borrowTemplate(
  user.name,
  book.title,
  borrow.dueDate
);

await sendEmail({
  email: user.email,
  subject: "Book Issued Successfully",
  message
});
 res.status(200).json({
    success:true,
    message:"Book borrowed successfully"
 })
})
   
export const returnBorrowedBook = catchAsynError(async(req,res,next)=>{
   const {bookId}=req.params;
   const{email}=req.body;
   const book = await Book.findById(bookId);
   if(!book){
    return next(new ErrorHandler("Book not found",404));
 }
 const user= await User.findOne({
    email,role:"Member",Accountverification:true
 })
 if(!user){
    return next(new ErrorHandler("User not registered",400));
 }
 const borrowedBook= user.borrowedBooks.find((b)=>b.bookId.toString()===bookId&&b.returned===false);
 if(!borrowedBook){return next(new ErrorHandler("This book is not borrowed by the requested user"),400)}
 borrowedBook.returned=true;
 await user.save();
 book.quantity+=1;
 book.availability=book.quantity>0;
 await book.save();

 const borrow=await Borrow.findOne({
   book:bookId,
   "user.email":email,
   returnDate:null
 })
 if(!borrow){return next(new ErrorHandler("This book is not borrowed by the requested user"),400)}
 borrow.returnDate= new Date();
 const fine=calculateFine(borrow.dueDate);
 borrow.fine = fine;
 await borrow.save();
 res.status(200).json({
   success:true,
   message:fine!==0?`Book returned successfully.Total overdue fine ₹${fine}`:"Book returned successfully"
 })
})


export const borrowedBooks = catchAsynError(async(req,res,next)=>{
 const {borrowedBooks}=req.user;
 res.status(200).json({
   success:true,
   borrowedBooks
 })
})

export const getBorrowedBooksForAdmin = catchAsynError(async(req,res,next)=>{
const borrowedBooks=await Borrow.find();
 res.status(200).json({
   success:true,
   borrowedBooks
 })
})