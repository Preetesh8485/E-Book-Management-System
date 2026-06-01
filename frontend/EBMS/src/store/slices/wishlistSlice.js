import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState: {
        loading: false,
        error: null,
        message: null,
    },

    reducers: {

        // ADD TO WISHLIST
        addWishlistReq(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },

        addWishlistSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },

        addWishlistFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // RESET
        resetWishlistSlice(state) {
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
});

// RESET
export const resetWishlistSlice = () => (dispatch) => {
    dispatch(wishlistSlice.actions.resetWishlistSlice());
};

// ADD TO WISHLIST
export const addToWishlist = (id) => async (dispatch) => {

    try {

        dispatch(wishlistSlice.actions.addWishlistReq());

        const res = await axios.post(
            `http://localhost:4000/api/v1/wishlist/notify`,
            { bookId: id },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch(
            wishlistSlice.actions.addWishlistSuccess(res.data)
        );

    } catch (error) {

        dispatch(
            wishlistSlice.actions.addWishlistFail(
                error.response?.data?.message ||
                "Something went wrong"
            )
        );
    }
};

export default wishlistSlice.reducer;