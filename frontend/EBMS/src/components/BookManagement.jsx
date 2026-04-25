import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup, toggleRecordBookPopup } from "../store/slices/popupSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popup/AddBookPopup"; 
import ReadBookPopup from "../popup/ReadBookPopup"; 
import RecordBookPopup from "../popup/RecordBookPopup"; 

const BookManagement = () => {
  const dispatch = useDispatch();
  const { loading, error, message, books } = useSelector(state => state.book);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { addBookPopup, readBookPopup, recordPopup } = useSelector(state => state.popup);
  const { loading: borrowSliceLoading, error: borrowSliceError, message: borrowSliceMessage } = useSelector(state => state.borrow);

  // Pagination State
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
  }

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice())
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error || borrowSliceError)
      dispatch(resetBookSlice())
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, loading, borrowSliceError, borrowSliceLoading, borrowSliceMessage])

  const [searchedKeyword, setSearchedKeyword] = useState("");
  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on search
  };

  const searchedBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(searchedKeyword) ||
    book.author?.toLowerCase().includes(searchedKeyword) ||
    book.location?.toLowerCase().includes(searchedKeyword) ||
    String(book.ISBN)?.toLowerCase().includes(searchedKeyword)
  );

  // Pagination Logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = searchedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(searchedBooks.length / booksPerPage);

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user && user.role === "Admin" ? "Book Management" : "Books"}
          </h2>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {isAuthenticated && user?.role === "Admin" && (
              <button onClick={() => dispatch(toggleAddBookPopup())} className="relative p-14 w-full sm:w-52 gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-white hover:text-black border-2 border-black transition duration-200">
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-6.25 h-6.25 absolute left-5">+</span>
                ADD Book
              </button>
            )}
            <input type="text" placeholder="Search books" className="w-full sm:w-52 border p-2 border-gray-300 rounded-md" value={searchedKeyword} onChange={handleSearch} />
          </div>
        </header>

        {searchedBooks && searchedBooks.length > 0 ? (
          <div className="mt-6 bg-white rounded-md shadow-lg overflow-hidden">
            <div className="overflow-x-auto"style={{overflowX: "auto"}}>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-4 text-left">ID</th>
                    <th className="px-4 py-4 text-left">Name</th>
                    <th className="px-4 py-4 text-left">Author</th>
                    <th className="px-4 py-4 text-left">Location</th>
                    <th className="px-4 py-4 text-left">ISBN</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-left">Quantity</th>
                    )}
                    <th className="px-4 py-4 text-left">Price</th>
                    <th className="px-4 py-4 text-left">Availability</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-left">Record Book</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.map((book, index) => (
                    <tr key={book._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{indexOfFirstBook + index + 1}</td>
                      <td className="px-4 py-2">{book.title}</td>
                      <td className="px-4 py-2">{book.author}</td>
                      <td className="px-4 py-2">{book.location}</td>
                      <td className="px-4 py-2">{book.ISBN}</td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-2 text-center">{book.quantity}</td>
                      )}
                      <td className="px-4 py-2">₹{book.price}</td>
                      <td className="px-4 py-2">{book.availability ? "Available" : "Unavailable"}</td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-2 flex space-x-2">
                          <BookA onClick={() => openReadPopup(book._id)} className="cursor-pointer" />
                          <NotebookPen onClick={() => openRecordBookpopup(book._id)} className="cursor-pointer" />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstBook + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastBook, searchedBooks.length)}
                </span>{" "}
                of <span className="font-medium">{searchedBooks.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`p-2 border rounded-md ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 border-black"}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center px-2 text-sm font-medium">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`p-2 border rounded-md ${currentPage === totalPages || totalPages === 0 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 border-black"}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">No books found in library!</h3>
        )}
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;