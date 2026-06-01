import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"
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
}
});

export const fetchUserBorrowedBooks = () => async (dispatch) => {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksReq());
    await axios.get("http://localhost:4000/api/borrow/borrowed-books", { withCredentials: true }).then(res => {
        dispatch(borrowSlice.actions.fetchUserBorrowedBooksSuccess(res.data.borrowedBooks));
    }).catch(err => {
        dispatch(borrowSlice.actions.fetchUserBorrowedBooksFail(err.response.data.error));
    })
}
export const fetchAllBorrowedBooks = () => async (dispatch) => {
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksReq());
    await axios.get("http://localhost:4000/api/borrow/get-borrowed-book-by-users", { withCredentials: true }).then(res => {
        dispatch(borrowSlice.actions.fetchAllBorrowedBooksSuccess(res.data.borrowedBooks));
    }).catch(err => {
        dispatch(borrowSlice.actions.fetchAllBorrowedBooksFail(err.response.data.error));
    })
}


export const recordBorrowBook = (email,id) => async (dispatch) => {
    dispatch(borrowSlice.actions.recordBookRequest());
    await axios.post(`http://localhost:4000/api/borrow/record-borrowed-book/${id}`, {email}, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
        dispatch(toggleRecordBookPopup())
    }).catch(err => { dispatch(borrowSlice.actions.recordBookFailed(err.response.data.error)); })
}
export const returnBook =({ email, bookId }) =>async(dispatch)=>{
    dispatch(borrowSlice.actions.returnBookRequest());
    await axios.put(`http://localhost:4000/api/borrow/return-borrowed-book/${bookId}`,{email},{withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        }
    }).then(res => {
        dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
    }).catch(err => { dispatch(borrowSlice.actions.returnBookFailed(err.response.data.error)); })
}

export const resetBorrowSlice=()=>async(dispatch)=>{
    dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;