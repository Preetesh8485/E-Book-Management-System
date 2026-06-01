import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const requestSlice = createSlice({
    name: "request",
    initialState: {
        loading: false,
        error: null,
        message: null,
        allRequests: [],
    },
    reducers: {
        requestBookReq(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        requestBookSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        requestBookFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        fetchAllRequestsReq(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        fetchAllRequestsSuccess(state, action) {
            state.loading = false;
            state.allRequests = action.payload;
        },
        fetchAllRequestsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        approveRequestReq(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        approveRequestSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        approveRequestFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        rejectRequestReq(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        rejectRequestSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        rejectRequestFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        resetRequestSlice(state) {
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
});

export const requestBook = (id) => async (dispatch) => {
    dispatch(requestSlice.actions.requestBookReq());

    await axios.post(
        `http://localhost:4000/api/request/request-book/${id}`,
        {},
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => {
        dispatch(requestSlice.actions.requestBookSuccess(res.data.message));
    }).catch((err) => {
        dispatch(requestSlice.actions.requestBookFail(err.response.data.error));
    });
};

export const fetchAllRequests = () => async (dispatch) => {
    dispatch(requestSlice.actions.fetchAllRequestsReq());

    await axios.get(
        "http://localhost:4000/api/request/all-requests",
        {
            withCredentials: true,
        }
    ).then((res) => {
        dispatch(requestSlice.actions.fetchAllRequestsSuccess(res.data.requests));
    }).catch((err) => {
        dispatch(requestSlice.actions.fetchAllRequestsFail(err.response.data.error));
    });
};

export const approveRequest = (requestId) => async (dispatch) => {
    dispatch(requestSlice.actions.approveRequestReq());

    await axios.put(
        `http://localhost:4000/api/request/approve-request/${requestId}`,
        {},
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => {
        dispatch(requestSlice.actions.approveRequestSuccess(res.data.message));
    }).catch((err) => {
        dispatch(requestSlice.actions.approveRequestFail(err.response.data.error));
    });
};

export const rejectRequest = (requestId) => async (dispatch) => {
    dispatch(requestSlice.actions.rejectRequestReq());

    await axios.put(
        `http://localhost:4000/api/request/reject-request/${requestId}`,
        {},
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => {
        dispatch(requestSlice.actions.rejectRequestSuccess(res.data.message));
    }).catch((err) => {
        dispatch(requestSlice.actions.rejectRequestFail(err.response.data.error));
    });
};

export const resetRequestSlice = () => async (dispatch) => {
    dispatch(requestSlice.actions.resetRequestSlice());
};

export default requestSlice.reducer;