import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://e-book-management-system-rprf.onrender.com";

const requestSlice = createSlice({
  name: "request",
  initialState: {
    loading: false,
    requests: [],
    myRequests: [],
    message: null,
    error: null,
  },

  reducers: {
    // FETCH ALL REQUESTS
    fetchRequestsReq(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    fetchRequestsSuccess(state, action) {
      state.loading = false;
      state.requests = action.payload;
      state.error = null;
    },

    fetchRequestsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // FETCH MY REQUESTS
    fetchMyRequestsReq(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    fetchMyRequestsSuccess(state, action) {
      state.loading = false;
      state.myRequests = action.payload;
      state.error = null;
    },

    fetchMyRequestsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // CREATE REQUEST
    createRequestReq(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    createRequestSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },

    createRequestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // APPROVE REQUEST
    approveRequestReq(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    approveRequestSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },

    approveRequestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // REJECT REQUEST
    rejectRequestReq(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    rejectRequestSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },

    rejectRequestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // RESET
    resetRequestSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const fetchAllRequests = () => async (dispatch) => {
  dispatch(requestSlice.actions.fetchRequestsReq());

  try {
    const res = await axios.get(`${BASE_URL}/api/request/all`, {
      withCredentials: true,
    });

    dispatch(
      requestSlice.actions.fetchRequestsSuccess(res.data.requests)
    );
  } catch (err) {
    dispatch(
      requestSlice.actions.fetchRequestsFail(
        err.response?.data?.error || "Something went wrong"
      )
    );
  }
};

export const fetchMyRequests = () => async (dispatch) => {
  dispatch(requestSlice.actions.fetchMyRequestsReq());

  try {
    const res = await axios.get(`${BASE_URL}/api/request/my`, {
      withCredentials: true,
    });

    dispatch(
      requestSlice.actions.fetchMyRequestsSuccess(res.data.requests)
    );
  } catch (err) {
    dispatch(
      requestSlice.actions.fetchMyRequestsFail(
        err.response?.data?.error || "Something went wrong"
      )
    );
  }
};

export const createBookRequest = (data) => async (dispatch) => {
  dispatch(requestSlice.actions.createRequestReq());

  try {
    const res = await axios.post(
      `${BASE_URL}/api/request/create`,
      data,
      { withCredentials: true }
    );

    dispatch(
      requestSlice.actions.createRequestSuccess(res.data.message)
    );
  } catch (err) {
    dispatch(
      requestSlice.actions.createRequestFail(
        err.response?.data?.error || "Something went wrong"
      )
    );
  }
};

export const approveRequest = (id) => async (dispatch) => {
  dispatch(requestSlice.actions.approveRequestReq());

  try {
    const res = await axios.put(
      `${BASE_URL}/api/request/approve/${id}`,
      {},
      { withCredentials: true }
    );

    dispatch(
      requestSlice.actions.approveRequestSuccess(res.data.message)
    );
  } catch (err) {
    dispatch(
      requestSlice.actions.approveRequestFail(
        err.response?.data?.error || "Something went wrong"
      )
    );
  }
};

export const rejectRequest = (id) => async (dispatch) => {
  dispatch(requestSlice.actions.rejectRequestReq());

  try {
    const res = await axios.put(
      `${BASE_URL}/api/request/reject/${id}`,
      {},
      { withCredentials: true }
    );

    dispatch(
      requestSlice.actions.rejectRequestSuccess(res.data.message)
    );
  } catch (err) {
    dispatch(
      requestSlice.actions.rejectRequestFail(
        err.response?.data?.error || "Something went wrong"
      )
    );
  }
};

export const resetRequestSlice = () => (dispatch) => {
  dispatch(requestSlice.actions.resetRequestSlice());
};

export default requestSlice.reducer;