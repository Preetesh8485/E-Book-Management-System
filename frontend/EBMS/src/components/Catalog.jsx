import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { Search, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popupSlice";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import ReturnBookPopup from "../popup/ReturnBookPopup";

const Catalog = () => {
  const dispatch = useDispatch();
  const { returnPopup } = useSelector((state) => state.popup);
  const { error, allBorrowedBooks, message } = useSelector((state) => state.borrow);
  
  const [filter, setFilter] = useState("borrowed");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDateandTime = (timeStamp) => {
    if (!timeStamp) return "";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const globalSearch = (book) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      String(book?.user?.regdno || "").toLowerCase().includes(searchStr) ||
      String(book?.user?.name || "").toLowerCase().includes(searchStr) ||
      String(book?.user?.email || "").toLowerCase().includes(searchStr)
    );
  };

  const currentDate = new Date();
  
  // 1. Filter logic
  const filteredData = allBorrowedBooks?.filter(book => {
    const dueDate = new Date(book.dueDate);
    const matchesFilter = filter === "borrowed" ? dueDate > currentDate : dueDate <= currentDate;
    return matchesFilter && globalSearch(book);
  }) || [];

  // 2. Sort logic: Pending books (returnDate === null) first
  const sortedBooks = [...filteredData].sort((a, b) => {
    // If 'a' is not returned and 'b' is returned, 'a' comes first
    if (!a.returnDate && b.returnDate) return -1;
    // If 'a' is returned and 'b' is not, 'b' comes first
    if (a.returnDate && !b.returnDate) return 1;
    // Otherwise, sort by most recent borrow date
    return new Date(b.borrowDate) - new Date(a.borrowDate);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  };

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        
        <header className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-gray-100 pb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              <Calendar className={filter === "borrowed" ? "text-[#00A7E1]" : "text-red-500"} size={28} />
              {filter === "borrowed" ? "Active Borrowings" : "Overdue Records"}
            </h2>
            <p className="text-sm text-gray-400 font-medium">Prioritizing pending returns</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === "borrowed" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400"}`}
                onClick={() => setFilter("borrowed")}
              >
                Active
              </button>
              <button
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === "overDue" ? "bg-white text-red-500 shadow-sm" : "text-gray-400"}`}
                onClick={() => setFilter("overDue")}
              >
                Overdue
              </button>
            </div>

            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search database..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {currentItems.length > 0 ? (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">#</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Information</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Fine</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentItems.map((book, index) => (
                    <tr key={index} className={`hover:bg-gray-50/50 transition-colors ${!book.returnDate ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-6 py-4 text-sm font-bold text-gray-300">
                        {(indexOfFirstItem + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${!book.returnDate ? 'text-gray-900' : 'text-gray-500'}`}>
                            {book?.user.name}
                          </span>
                          <span className="text-[11px] text-gray-400">ID: {book?.user.regdno}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-[11px]">
                          <span className="font-bold text-gray-700">Due: {formatDate(book.dueDate)}</span>
                          <span className="text-gray-400">Issued: {formatDateandTime(book.borrowDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-black ${book.fine > 0 ? "text-red-600" : "text-gray-300"}`}>
                          ₹{book.fine || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {book.returnDate ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">
                            <CheckCircle2 size={12} /> Returned
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            filter === "overDue" ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-100 text-blue-600"
                          }`}>
                            <AlertCircle size={12} /> {filter === "overDue" ? "Overdue" : "Pending"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {book.returnDate ? (
                          <FaSquareCheck className="ml-auto w-6 h-6 text-green-500 opacity-60" />
                        ) : (
                          <button
                            onClick={() => openReturnBookPopup(book.book, book?.user.email)}
                            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-[#00A7E1] transition-all"
                          >
                            <PiKeyReturnBold className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-20 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-gray-800">No records matching filters</h3>
          </div>
        )}
      </main>
      {returnPopup && <ReturnBookPopup bookId={borrowedBookId} email={email} />}
    </>
  );
};

export default Catalog;