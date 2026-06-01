import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import orderReducer from "./slices/OrderSlice"
import popupReducer from "./slices/popupSlice"
import userReducer from "./slices/userSlice"
import bookReducer from "./slices/bookSlice"
import borrowReducer from"./slices/borrowSlice"
import wishlistReducer from "./slices/wishlistSlice"
import requestReducer from "./slices/requestSlice"
export const store = configureStore({
    reducer:{
        auth:authReducer,
        order:orderReducer,
        popup:popupReducer,
        user:userReducer,
        book:bookReducer,
        borrow:borrowReducer,
        wishlist:wishlistReducer,
        request:requestReducer
    }
})