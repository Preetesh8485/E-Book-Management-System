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
        metadata: null,
        metadataLoading: false,
        metadataError: null,
    },
    reducers: {
        generateMetadataReq(state) {
            state.metadataLoading = true;
            state.metadataError = null;
        },

        generateMetadataSuccess(state, action) {
            state.metadataLoading = false;
            state.metadata = action.payload;
        },

        generateMetadataFail(state, action) {
            state.metadataLoading = false;
            state.metadataError = action.payload;
        },
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
        resetBookSlice(state) {
            state.error = null;
            state.message = null;
            state.loading = false;
        },
        deleteBookRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        deleteBookSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        deleteBookFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

    }
});

export const fetchAllBooks = () => async (dispatch) => {
    dispatch(bookSlice.actions.fetchBooksReq());
    await axios.get("https://e-book-management-system-rprf.onrender.com/api/book/showBook", { withCredentials: true }).then(res => {
        dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
    }).catch(err => {
        dispatch(bookSlice.actions.fetchBooksFail(err.response.data.error));
    })
}
export const addBook = (data) => async (dispatch) => {
    dispatch(bookSlice.actions.addBookRequest());
    await axios.post("https://e-book-management-system-rprf.onrender.com/api/book/admin/addBook", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => {
        dispatch(bookSlice.actions.addBookSuccess(res.data.message));
        dispatch(toggleAddBookPopup());
    }).catch(err => { dispatch(bookSlice.actions.addBookFailed(err.response.data.error)); })
}
export const deleteBook = (id) => async (dispatch) => {
    dispatch(bookSlice.actions.deleteBookRequest());
    await axios.delete(`https://e-book-management-system-rprf.onrender.com/api/book/admin/delete/${id}`, { withCredentials: true, }
    )
        .then((res) => {
            dispatch(bookSlice.actions.deleteBookSuccess(res.data.message));
        })
        .catch((err) => {
            dispatch(
                bookSlice.actions.deleteBookFailed(
                    err.response.data.error
                )
            );
        });
};
export const resetBookSlice = () => async (dispatch) => {
    dispatch(bookSlice.actions.resetBookSlice());
};
export const generateBookMetadata =
    (data) => async (dispatch) => {

        dispatch(
            bookSlice.actions.generateMetadataReq()
        );

        await axios.post(
            "https://e-book-management-system-rprf.onrender.com/api/book/admin/generate-metadata",
            data,
            {
                withCredentials: true,
            }
        )
            .then((res) => {

                dispatch(
                    bookSlice.actions.generateMetadataSuccess(
                        res.data.metadata
                    )
                );

            })
            .catch((err) => {

                dispatch(
                    bookSlice.actions.generateMetadataFail(
                        err.response?.data?.error ||
                        err.response?.data?.message ||
                        "Failed to generate metadata"
                    )
                );

            });
    };
export default bookSlice.reducer;