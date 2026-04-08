import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { toggleAddBookPopup } from "./popupSlice";

const bookSlice = createSlice({
    name: "book",
    initialState: {
        loading: false,
        error: null,
        message: null,
        books: [],
    },
    reducers: {
        fetchBooksReq(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        fetchBooksSuccess(state, action) {
            state.loading = false;
            state.books = action.payload;
            state.message = null;
        },
        fetchBooksFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },
    addBookRequest(state) {
        state.loading = true;
        state.error = null;
        state.message = null;
    },
    addBookSuccess(state, action) {
        state.loading = false;
         state.message = action.payload;
     },
    addBookFailed(state, action) {
        state.loading = false;
        state.error = action.payload;
     },
    resetBookSlice(state){
        state.error=null;
        state.message = null;
        state.loading = false;
    }
}
});

export const fetchAllBooks =()=>async(dispatch)=>{
    dispatch(bookSlice.actions.fetchBooksReq());
    await axios.get("http://localhost:4000/api/book/showBook", {withCredentials:true}).then(res=>{
        dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
    }).catch(err=>{
        dispatch(bookSlice.actions.fetchBooksFail(err.response.data.error));
    })
}
export const addBook=(data)=>async(dispatch)=>{
    dispatch(bookSlice.actions.addBookRequest());
    await axios.post("http://localhost:4000/api/book/admin/addBook",data,{withCredentials:true,
        Headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        dispatch(bookSlice.actions.addBookSuccess(res.data.message));
        dispatch(toggleAddBookPopup());
    }).catch(err=>{dispatch(bookSlice.actions.addBookFailed(err.response.data.error));})
}
export const resetBookSlice=()=>async(dispatch)=>{
    dispatch(bookSlice.actions.resetBookSlice());
};
export default  bookSlice.reducer;