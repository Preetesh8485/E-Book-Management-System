import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import orderReducer from "./slices/OrderSlice"
import popupReducer from "./slices/popupSlice"
import userReducer from "./slices/userSlice"
export const store = configureStore({
    reducer:{
        auth:authReducer,
        order:orderReducer,
        popup:popupReducer,
        user:userReducer,
    }
})