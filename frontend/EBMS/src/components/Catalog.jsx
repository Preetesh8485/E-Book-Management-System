import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
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
  const { loading, error, allBorrowedBooks, message } = useSelector((state) => state.borrow);
  
  const [filter, setFilter] = useState("borrowed");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDateandTime = (timeStamp) => {
    if (!timeStamp) return "";
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
  };

  const globalSearch = (book) => {
    const searchStr = searchTerm.toLowerCase();
    const regdno = String(book?.user?.regdno || "").toLowerCase();
    const name = String(book?.user?.name || "").toLowerCase();
    const email = String(book?.user?.email || "").toLowerCase();
    const price = String(book?.price || "").toLowerCase();
    const dueDate = formatDate(book.dueDate).toLowerCase();
    const borrowDate = formatDateandTime(book.borrowDate).toLowerCase();
    const returnDate = book.returnDate ? formatDateandTime(book.returnDate).toLowerCase() : "";

    return (
      regdno.includes(searchStr) ||
      name.includes(searchStr) ||
      email.includes(searchStr) ||
      price.includes(searchStr) ||
      dueDate.includes(searchStr) ||
      borrowDate.includes(searchStr) ||
      returnDate.includes(searchStr)
    );
  };

  const currentDate = new Date();
  
  const filteredBooks = allBorrowedBooks?.filter(book => {
    const dueDate = new Date(book.dueDate);
    const matchesFilter = filter === "borrowed" ? dueDate > currentDate : dueDate <= currentDate;
    return matchesFilter && globalSearch(book);
  }) || [];

  // Logic for Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

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

  // Reset to first page when filtering or searching
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
        <header className="flex flex-col gap-3 sm:flex-row md:items-center justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg
              sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "borrowed" ? "bg-black text-white border-black" : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("borrowed")}
            >
              Borrowed books
            </button>

            <button
              className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg
              sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
                filter === "overDue" ? "bg-black text-white border-black" : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("overDue")}
            >
              Overdue Books
            </button>
          </div>

          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search table..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {currentItems.length > 0 ? (
          <>
            <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg"style={{overflowX: "auto"}}>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">S No.</th>
                    <th className="px-4 py-2 text-left">Regdno</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-left">Issue Date</th>
                    <th className="px-4 py-2 text-left">Return Date</th>
                    <th className="px-4 py-2 text-left">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((book, index) => (
                    <tr key={index} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>
                      <td className="px-4 py-2">{book?.user.regdno}</td>
                      <td className="px-4 py-2">{book?.user.name}</td>
                      <td className="px-4 py-2">{book?.user.email}</td>
                      <td className="px-4 py-2">{book.price}</td>
                      <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                      <td className="px-4 py-2">{formatDateandTime(book.borrowDate)}</td>
                      <td className="px-4 py-2">{book.returnDate ? formatDateandTime(book.returnDate) : ""}</td>
                      <td className="px-4 py-2">
                        {book.returnDate ? (
                          <FaSquareCheck className="w-6 h-6" />
                        ) : (
                          <PiKeyReturnBold
                            onClick={() => openReturnBookPopup(book.book, book?.user.email)}
                            className="w-6 h-6 cursor-pointer"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No {filter === "borrowed" ? "borrowed" : "overDue"} books found{searchTerm && ` matching "${searchTerm}"`}.
          </h3>
        )}
      </main>
      {returnPopup && <ReturnBookPopup bookId={borrowedBookId} email={email} />}
    </>
  );
};

export default Catalog;