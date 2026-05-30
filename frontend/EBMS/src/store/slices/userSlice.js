import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popupSlice";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
    },
    reducers: {
        fetchAllUserRequest(state) {
            state.loading = true;
        },
        fetchAllUserSuccess(state, action) {
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUserFail(state) {
            state.loading = false;
        },
        addNewAdminRequest(state) {
            state.loading = true;
        },
        addNewAdminSuccess(state) {
            state.loading = false
        },
        addNewAdminFail(state) {
            state.loading = false
        },
        deleteUserRequest(state) {
            state.loading = true;
        },
        deleteUserSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        deleteUserFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    }
});
export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUserRequest());
    await axios.get("https://e-book-management-system-rprf.onrender.com/api/user/all", { withCredentials: true }).then(res => {
        dispatch(userSlice.actions.fetchAllUserSuccess(res.data.users))
    }).catch(err => {
        dispatch(userSlice.actions.fetchAllUserFail(err.response.data.message))
    })
}
export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest());
    await axios.post("https://e-book-management-system-rprf.onrender.com/api/user/add/new-admin", data, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => {
        dispatch(userSlice.actions.addNewAdminSuccess());
        toast.success(res.data.message)
        dispatch(toggleAddNewAdminPopup())
    }).catch(err => {
        dispatch(userSlice.actions.addNewAdminFail());
        toast.error(err.response.data.error)
    });

}
export const deleteUser = (id) => async (dispatch) => {
    dispatch(userSlice.actions.deleteUserRequest());
    try {
        const res = await axios.delete(
            `https://e-book-management-system-rprf.onrender.com/api/user/remove/member/${id}`,
            { withCredentials: true }
        );

        dispatch(userSlice.actions.deleteUserSuccess(res.data.message));
        toast.success(res.data.message)
    } catch (err) {
        toast.error(err.response.data.error);
        dispatch(userSlice.actions.deleteUserFailed(err.response.data.error));
    }
};
export default userSlice.reducer;