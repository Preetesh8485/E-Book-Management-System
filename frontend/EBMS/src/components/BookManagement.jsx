import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, ChevronLeft, ChevronRight, Search, Plus, BookOpen, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup, toggleRecordBookPopup } from "../store/slices/popupSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice, deleteBook } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import { createBookRequest, resetRequestSlice } from "../store/slices/requestSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popup/AddBookPopup";
import ReadBookPopup from "../popup/ReadBookPopup";
import RecordBookPopup from "../popup/RecordBookPopup";
import axios from "axios";
import { socket } from "../socket.js"

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector(state => state.book);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { addBookPopup, readBookPopup, recordPopup } = useSelector(state => state.popup);
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
    allBorrowedBooks,
  } = useSelector(state => state.borrow);
  const {
    message: requestMessage,
    error: requestError,
  } = useSelector(state => state.request);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const [readBook, setReadBook] = useState({});
  const openReadPopup = (id) => {
    const book = books.find(book => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const [borrowBookId, setBorrowBookId] = useState("");
  const openRecordBookpopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  const handleNotify = async (bookId) => {
    try {
      const { data } = await axios.post(
        "https://e-book-management-system-rprf.onrender.com/api/wishlist/notify",
        { bookId },
        { withCredentials: true }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to subscribe");
    }
  };
  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);
  // Book / borrow slice toasts
  useEffect(() => {

    if (message || borrowSliceMessage) {

      toast.success(message || borrowSliceMessage);

      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());

      setTimeout(() => {

        dispatch(resetBookSlice());
        dispatch(resetBorrowSlice());

      }, 500);
    }

    if (error || borrowSliceError) {

      toast.error(error || borrowSliceError);

      setTimeout(() => {

        dispatch(resetBookSlice());
        dispatch(resetBorrowSlice());

      }, 500);
    }

  }, [
    dispatch,
    message,
    error,
    borrowSliceError,
    borrowSliceMessage
  ]);
  useEffect(() => {
    socket.on("requestApproved", () => {
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
    });

    socket.on("requestRejected", () => {
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
    });

    return () => {
      socket.off("requestApproved");
      socket.off("requestRejected");
    };
  }, [dispatch]);
  // Request slice toasts
  useEffect(() => {
    if (requestMessage) {
      toast.success(requestMessage);
      dispatch(resetRequestSlice());
    }
    if (requestError) {
      toast.error(requestError);
      dispatch(resetRequestSlice());
    }
  }, [dispatch, requestMessage, requestError]);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const searchedBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(searchedKeyword) ||
    book.author?.toLowerCase().includes(searchedKeyword) ||
    book.location?.toLowerCase().includes(searchedKeyword) ||
    String(book.ISBN)?.toLowerCase().includes(searchedKeyword)
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = searchedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(searchedBooks.length / booksPerPage);

  // Check if member already has this book borrowed
  const isAlreadyBorrowed = (bookId) => {
    return allBorrowedBooks?.some(
      (b) =>
        b.book?._id?.toString() === bookId?.toString() &&
        !b.returnDate
    );
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Header Section */}
        <header className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-end border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              <BookOpen className="text-[#00A7E1]" size={28} />
              {user?.role === "Admin" ? "Book Management" : "Library Collection"}
            </h2>
            <p className="text-sm text-gray-400 font-medium">Explore and manage the digital repository</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A7E1] transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by title, author, ISBN..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A7E1]/20 focus:border-[#00A7E1] outline-none transition-all text-sm"
                value={searchedKeyword}
                onChange={handleSearch}
              />
            </div>

            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="flex items-center justify-center gap-2 py-2.5 px-6 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transform active:scale-95 transition-all shadow-md shadow-black/10"
              >
                <Plus size={18} />
                ADD BOOK
              </button>
            )}
          </div>
        </header>

        {searchedBooks && searchedBooks.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div style={{ overflow: "auto" }}>
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Book Details</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ISBN</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                    )}
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentBooks.map((book, index) => (
                    <tr key={book._id} className="hover:bg-gray-100 transition-colors group">

                      {/* ID */}
                      <td className="px-6 py-4 text-sm font-bold text-gray-300">
                        {(indexOfFirstBook + index + 1).toString().padStart(2, "0")}
                      </td>

                      {/* Book Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Prevent the image from shrinking */}
                          <img
                            src={book.image?.url}
                            alt="book"
                            className="w-20 h-28 object-cover rounded-md shrink-0"
                          />

                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-gray-800 ">{book.title}</span>
                            <span className="text-xs text-gray-400 font-medium">{book.author}</span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                          {book.location}
                        </span>
                      </td>

                      {/* ISBN */}
                      <td className="px-6 py-4 text-xs font-mono text-gray-500 tracking-tighter">
                        {book.ISBN}
                      </td>

                      {/* Stock — Admin only */}
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm font-black ${book.quantity < 5 ? "text-red-500" : "text-gray-700"}`}>
                            {book.quantity}
                          </span>
                        </td>
                      )}

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-black text-gray-800">
                        ₹{book.price}
                      </td>

                      {/* Status + Actions for Member */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">

                          {/* Availability dot */}
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${book.availability ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
                          <span className={`text-[11px] font-bold uppercase ${book.availability ? "text-green-600" : "text-red-400"}`}>
                            {book.availability ? "In Stock" : "Out of Stock"}
                          </span>

                          {/* Member: Request / Already Borrowed */}
                          {isAuthenticated && user?.role === "Member" && (
                            isAlreadyBorrowed(book._id) ? (
                              <span className="px-3 py-1 text-[10px] bg-gray-100 text-gray-400 rounded-md font-bold">
                                Already Borrowed
                              </span>
                            ) : (
                              <button
                                onClick={() => dispatch(createBookRequest({ book: book._id }))}
                                className="px-3 py-1 text-[10px] bg-[#0047AB] text-white rounded-md hover:bg-[#003580] transition-all active:scale-95"
                              >
                                Request Book
                              </button>
                            )
                          )}

                          {/* Member: Notify Me when out of stock */}
                          {isAuthenticated && user?.role === "Member" && !book.availability && (
                            <button
                              onClick={() => handleNotify(book._id)}
                              className="px-3 py-1 text-[10px] bg-black text-white rounded-md hover:bg-gray-800 transition-all active:scale-95"
                            >
                              Notify Me
                            </button>
                          )}

                        </div>
                      </td>

                      {/* Admin Actions */}
                      {/* Admin Actions */}
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-3">

                            {/* View */}
                            <button
                              onClick={() => openReadPopup(book._id)}
                              className="p-2 text-gray-400 hover:text-[#00A7E1] hover:bg-[#00A7E1]/5 rounded-lg transition-all"
                              title="View Details"
                            >
                              <BookA size={18} />
                            </button>

                            {/* Record */}
                            <button
                              onClick={() => openRecordBookpopup(book._id)}
                              className="p-2 text-gray-400 hover:text-[#FFA630] hover:bg-[#FFA630]/5 rounded-lg transition-all"
                              title="Record Transaction"
                            >
                              <NotebookPen size={18} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this book?")) {
                                  dispatch(deleteBook(book._id));
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Book"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>
                        </td>
                      )}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Showing{" "}
                <span className="text-gray-800">{indexOfFirstBook + 1}</span> -{" "}
                <span className="text-gray-800">{Math.min(indexOfLastBook, searchedBooks.length)}</span>{" "}
                of {searchedBooks.length}
              </p>
              <div className="flex items-center gap-4">
                <div className="text-[11px] font-black text-gray-500 uppercase tracking-tighter">
                  Page {currentPage} / {totalPages || 1}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`p-2 rounded-lg border transition-all ${currentPage === 1
                      ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                      : "bg-white border-gray-300 text-gray-700 hover:border-black active:scale-90"
                      }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`p-2 rounded-lg border transition-all ${currentPage === totalPages || totalPages === 0
                      ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                      : "bg-white border-gray-300 text-gray-700 hover:border-black active:scale-90"
                      }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-200" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">No books found in library!</h3>
            <p className="text-sm text-gray-400">Try adjusting your search keyword or filters.</p>
          </div>
        )}
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;