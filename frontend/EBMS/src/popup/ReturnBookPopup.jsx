import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllBorrowedBooks, resetBorrowSlice, returnBook } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popupSlice";
import { toast } from "react-toastify";
import { fetchAllBooks } from "../store/slices/bookSlice";

const ReturnBookPopup = ({ bookId, email }) => {
  const dispatch = useDispatch();
  const { message, error } = useSelector(state => state.borrow);
  const handleReturnBook = async (e) => {
    e.preventDefault();
    const success = await dispatch(returnBook({ email, bookId }));
    if (success) dispatch(toggleReturnBookPopup());
  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSlice());
      dispatch(toggleReturnBookPopup());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [message, error, dispatch]);
  return <>
    <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Return Book</h3>

          <form onSubmit={handleReturnBook}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                User Email
              </label>
              <input type="email" required defaultValue={email} placeholder="Borrower's email" className="w-full px-4 py-2 border-2 border-black rounded-md" />
            </div>
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" type="button" onClick={() => { dispatch(toggleReturnBookPopup()) }}>
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Return
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;
};

export default ReturnBookPopup;