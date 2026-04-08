import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        loading: false,
        error: null,
        message: null,
        order: null,
        orders: [],
    },
    reducers: {
        createOrderReq(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        createOrderSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.order = action.payload.order;
            state.orders.unshift(action.payload.order);
        },
        createOrderFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // MARK DELIVERED
        deliverOrderReq(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        deliverOrderSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.orders = state.orders.map(order =>
                order._id === action.payload.order._id
                    ? action.payload.order
                    : order
            );
        },
        deliverOrderFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        getOrdersReq(state) {
            state.loading = true;
        },
        getOrdersSuccess(state, action) {
            state.loading = false;
            state.orders = action.payload.orders;
        },
        getOrdersFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetOrderSlice(state) {
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
});

export const resetOrderSlice = () => (dispatch) => {
    dispatch(orderSlice.actions.resetOrderSlice());
};
// CREATE ORDER
export const createOrder = (data) => async (dispatch) => {
    try {
        dispatch(orderSlice.actions.createOrderReq());

        const res = await axios.post(
            "http://localhost:4000/api/order/create",
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch(orderSlice.actions.createOrderSuccess(res.data));
    } catch (error) {
        dispatch(
            orderSlice.actions.createOrderFail(
                error.response?.data?.message || "Something went wrong"
            )
        );
    }
};

// MARK AS DELIVERED
export const markOrderDelivered = (id) => async (dispatch) => {
    try {
        dispatch(orderSlice.actions.deliverOrderReq());

        const res = await axios.put(
            `http://localhost:4000/api/order/deliver/${id}`,
            {},
            { withCredentials: true }
        );

        dispatch(orderSlice.actions.deliverOrderSuccess(res.data));
    } catch (error) {
        dispatch(
            orderSlice.actions.deliverOrderFail(
                error.response?.data?.message || "Something went wrong"
            )
        );
    }
};

export const getAllOrders = () => async (dispatch) => {
    try {
        dispatch(orderSlice.actions.getOrdersReq());

        const res = await axios.get(
            "http://localhost:4000/api/order/all",
            { withCredentials: true }
        );

        dispatch(orderSlice.actions.getOrdersSuccess(res.data));

    } catch (error) {
        dispatch(
            orderSlice.actions.getOrdersFail(
                error.response?.data?.message || "Something went wrong"
            )
        );
    }
};

export default orderSlice.reducer;