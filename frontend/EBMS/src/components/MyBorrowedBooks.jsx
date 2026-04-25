import React, { useState } from "react";
import { BookA, Search, Calendar, Clock, ChevronRight, ReceiptIndianRupee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popupSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popup/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);
  const [readBook, setReadBook] = useState({});
  const [filter, setFilter] = useState("nonReturned");

  // Utility to calculate fine: ₹10 per day overdue
  const calculateFine = (dueDate, isReturned, returnedDate) => {
    const due = new Date(dueDate);
    const referenceDate = isReturned ? new Date(returnedDate) : new Date();
    
    if (referenceDate > due) {
      const diffTime = Math.abs(referenceDate - due);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * 10;
    }
    return 0;
  };

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const returnedBooks = userBorrowedBooks?.filter((book) => book.returned === true) || [];
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => book.returned === false) || [];
  const booksToDisplay = filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="relative flex-1 p-6 pt-24 bg-gray-200 min-h-screen flex flex-col items-center overflow-y-auto w-full">
        <Header />

        <div className="max-w-7xl w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                Reading Inventory
              </h2>
              <p className="text-gray-500 font-medium">Tracking your active and past library assets</p>
            </div>

            <div className="flex bg-gray-200/50 p-1 rounded-xl w-fit border border-gray-200">
              <button
                onClick={() => setFilter("nonReturned")}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === "nonReturned" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Active Loans
              </button>
              <button
                onClick={() => setFilter("returned")}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === "returned" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Past History
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {booksToDisplay && booksToDisplay.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Asset Info</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Timeline</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Fine Amount</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">About Book</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {booksToDisplay.map((book, index) => {
                      const fine = calculateFine(book.dueDate, book.returned, book.returnedDate);
                      return (
                        <tr key={index} className="group hover:bg-gray-50/80 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-lg shadow-gray-200">
                                <BookA size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 leading-tight">{book.BookTitle}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">REF: #{book.bookId?.slice(-6)}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                <Calendar size={14} className="text-gray-300" />
                                <span>{formatDate(book.borrowedDate)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-orange-400 uppercase tracking-tighter">
                                <Clock size={12} />
                                <span>Due: {formatDate(book.dueDate)}</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-6 text-center">
                            <div className={`inline-flex items-center gap-1 font-black text-sm ${fine > 0 ? 'text-red-600' : 'text-gray-300'}`}>
                              <ReceiptIndianRupee size={14} />
                              <span>{fine.toLocaleString('en-IN')}</span>
                            </div>
                          </td>

                          <td className="px-8 py-6 text-center">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                              book.returned ? "bg-blue-50 text-blue-500" : "bg-orange-50 text-orange-500"
                            }`}>
                              {book.returned ? "Returned" : "Active"}
                            </span>
                          </td>

                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => openReadPopup(book.bookId)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-900 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-gray-900 hover:text-white transition-all group"
                            >
                              Details
                              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-dashed border-gray-200">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">No records found</h3>
              </div>
            )}
          </div>
        </div>
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;