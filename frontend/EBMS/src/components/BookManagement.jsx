import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
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
  const {
    loading,
    error,
    message,
    books, } = useSelector(state => state.book);
  const {
    isAuthenticated, user } = useSelector(state => state.auth);
  const {
    addBookPopup,
    readBookPopup,
    recordPopup,
  } = useSelector(state => state.popup);
  const { loading: borrowSliceLoading, error: borrowSliceError, message: borrowSliceMessage } = useSelector(state => state.borrow);

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
  };
  const searchedBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(searchedKeyword) ||
    book.author?.toLowerCase().includes(searchedKeyword) ||
    String(book.ISBN)?.toLowerCase().includes(searchedKeyword)
  );
useEffect(() => {
  dispatch(fetchAllBooks());
}, [dispatch]);

  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
          {user && user.role === "Admin" ? "Book Management" : "Books"}
        </h2>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {
            isAuthenticated && user?.role === "Admin" && (

              <button onClick={() => dispatch(toggleAddBookPopup())} className="relative p-14 w-full sm:w-52 gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-white hover:text-black border-2 border-black transition duration-200">
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-6.25 h-6.25 absolute left-5">+
                </span>
                ADD Book
              </button>
            )
          }
          <input type="text" placeholder="Search books" className="w-full sm:w-52 border p-2 border-gray-300 rounded-md" value={searchedKeyword} onChange={handleSearch} />
        </div>
      </header>
      {
        books && books.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg"  style={{ overflow: "auto" }}>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-4 text-left">ID</th>
                  <th className="px-4 py-4 text-left">Name</th>
                  <th className="px-4 py-4 text-left">Author</th>
                  <th className="px-4 py-4 text-left">Location</th>
                  <th className="px-4 py-4 text-left">ISBN</th>
                  {
                    isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-left">Quantity</th>
                    )
                  }
                  <th className="px-4 py-4 text-left">Price</th>
                  <th className="px-4 py-4 text-left">Availability</th>
                  {
                    isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-2 text-left">Record Book</th>
                    )
                  }
                </tr>
              </thead>
              <tbody>
                {searchedBooks.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    {/* ID */}
                    <td className="px-4 py-2">{index + 1}</td>

                    {/* Name */}
                    <td className="px-4 py-2">{book.title}</td>

                    {/* Author */}
                    <td className="px-4 py-2">{book.author}</td>

                    {/* Location */}
                    <td className="px-4 py-2">{book.location}</td>

                    {/* ISBN */}
                    <td className="px-4 py-2">{book.ISBN}</td>

                    {/* Quantity (Admin only) */}
                    {isAuthenticated && user?.role === "Admin" && (
                      <td className="px-4 py-2  text-center">{book.quantity}</td>
                    )}

                    {/* Price */}
                    <td className="px-4 py-2">₹{book.price}</td>

                    {/* Availability */}
                    <td className="px-4 py-2">
                      {book.availability ? "Available" : "Unavailable"}
                    </td>

                    {/* Record Book (Admin only) */}
                    {isAuthenticated && user?.role === "Admin" && (
                      <td className="px-4 py-2 flex space-x-2">
                        <BookA
                          onClick={() => openReadPopup(book._id)}
                          className="cursor-pointer"
                        />
                        <NotebookPen
                          onClick={() => openRecordBookpopup(book._id)}
                          className="cursor-pointer"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">No books found in library!</h3>
        )
      }
    </main>
{addBookPopup && <AddBookPopup />}
{readBookPopup && <ReadBookPopup book={readBook} />}
{recordPopup && <RecordBookPopup bookId={borrowBookId} />}
  </>;
};

export default BookManagement;
