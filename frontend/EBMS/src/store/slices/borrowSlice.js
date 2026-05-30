import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup } from "./popupSlice";

const borrowSlice = createSlice({
  name: "borrow",

  initialState: {
    loading: false,
    error: null,
    message: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
  },

  reducers: {

    fetchUserBorrowedBooksReq(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
      state.error = null;
    },

    fetchUserBorrowedBooksFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },



    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    recordBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },

    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },



    fetchAllBorrowedBooksReq(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
      state.error = null;
    },

    fetchAllBorrowedBooksFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },



    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },

    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },



    resetBorrowSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});



export const fetchUserBorrowedBooks = () => async (dispatch) => {

  try {

    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksReq()
    );

    const res = await axios.get(
      "https://e-book-management-system-rprf.onrender.com/api/borrow/borrowed-books",
      {
        withCredentials: true,
      }
    );

    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksSuccess(
        res.data.borrowedBooks
      )
    );

  } catch (err) {

    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksFail(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong"
      )
    );
  }
};



export const fetchAllBorrowedBooks = () => async (dispatch) => {

  try {

    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksReq()
    );

    const res = await axios.get(
      "https://e-book-management-system-rprf.onrender.com/api/borrow/get-borrowed-book-by-users",
      {
        withCredentials: true,
      }
    );

    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksSuccess(
        res.data.borrowedBooks
      )
    );

  } catch (err) {

    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksFail(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong"
      )
    );
  }
};



export const recordBorrowBook =
  (email, id) => async (dispatch) => {

    try {

      dispatch(
        borrowSlice.actions.recordBookRequest()
      );

      const res = await axios.post(
        `https://e-book-management-system-rprf.onrender.com/api/borrow/record-borrowed-book/${id}`,
        { email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(
        borrowSlice.actions.recordBookSuccess(
          res.data.message
        )
      );

      dispatch(toggleRecordBookPopup());

      return true;

    } catch (err) {

      dispatch(
        borrowSlice.actions.recordBookFailed(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong"
        )
      );

      return false;
    }
  };



export const returnBook =
  ({ email, bookId }) =>
  async (dispatch) => {

    try {

      dispatch(
        borrowSlice.actions.returnBookRequest()
      );

      const res = await axios.put(
        `https://e-book-management-system-rprf.onrender.com/api/borrow/return-borrowed-book/${bookId}`,
        { email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(
        borrowSlice.actions.returnBookSuccess(
          res.data.message
        )
      );

      return true;

    } catch (err) {

      dispatch(
        borrowSlice.actions.returnBookFailed(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong"
        )
      );

      return false;
    }
  };



export const resetBorrowSlice = () => async (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};



export default borrowSlice.reducer;