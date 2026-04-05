import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
 
const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        error:null,
        message:null,
        user:null,
        isAuthenticated:false,
    },
    reducers:{
        registerReq(state){
            state.loading =true;
            state.error=null;
            state.message=null;
        },
        registerSuccess(state,action){
            state.loading=false;
            state.message=action.payload.message;
        },
        registerFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        OtpVerificationReq(state){
            state.loading =true;
            state.error=null;
            state.message=null;
        },
        OtpVerificationSuccess(state,action){
            state.loading=false;
            state.message=action.payload.message;
            state.isAuthenticated=true;
            state.user=action.payload.user;
        },
        OtpVerificationFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        LoginReq(state){
            state.loading =true;
            state.error=null;
            state.message=null;
        },
        LoginSuccess(state,action){
            state.loading=false;
            state.message=action.payload.message;
            state.isAuthenticated=true;
            state.user=action.payload.user;
        },
        LoginFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        logoutReq(state){
            state.loading=true;
            state.message=null;
            state.error=null;
        },
        LogoutSuccess(state,action){
            state.loading=false;
            state.message=action.payload.message;
            state.isAuthenticated=false;
            state.user=null;
        },
        LogoutFail(state,action){
            state.loading=false;
            state.error=action.payload;
            state.message=null;
        },
        getUserReq(state){
            state.loading=true;
            state.error=null;
            state.message=null;
        },
        getUserSuccess(state,action){
            state.loading=false;
            state.user=action.payload.user;
            state.isAuthenticated=true;
        },
        getUserFail(state){
            state.loading=false;
            state.user=null;
            state.isAuthenticated=false;
        },
        ForgotPasswordReq(state){
            state.loading=true;
            state.error=null;
            state.message=null;
        },
        ForgotPasswordSuccess(state,action){
            state.loading=false;
            state.message=action.payload;
        },
        ForgotPasswordFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        ResetPasswordReq(state){
            state.loading=true;
            state.error=null;
            state.message=null;
        },
        ResetPasswordSuccess(state,action){
            state.loading=false;
            state.message=action.payload;
            state.user=action.payload.user;
            state.isAuthenticated=true;
        },
        ResetPasswordFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        UpdatePasswordReq(state){
            state.loading=true;
            state.error=null;
            state.message=null;
        },
        UpdatePasswordSuccess(state,action){
            state.loading=false;
            state.message=action.payload;
        },
        UpdatePasswordFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        resetAuthSlice(state){
            state.error=null;
            state.loading=false;
            state.message=null;
            // state.user=state.user;
            // state.isAuthenticated=state.isAuthenticated;
        }
    }
})

export const resetAuthSlice=()=>(dispatch)=>{
    dispatch(authSlice.actions.resetAuthSlice())
}

export const register=(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.registerReq());
    await axios
    .post("http://localhost:4000/api/auth/register",data,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.registerSuccess(res.data));
    })
    .catch((error)=>{
        dispatch(authSlice.actions.registerFail(error.response.data.error));
    })
}
export const otpVerification=(email,otp)=>async(dispatch)=>{
    dispatch(authSlice.actions.OtpVerificationReq());
    await axios
    .post("http://localhost:4000/api/auth/verify-otp",{email,otp},{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.OtpVerificationSuccess(res.data));
    })
    .catch((error)=>{
        dispatch(authSlice.actions.OtpVerificationFail(error.response.data.error));
    })
}
export const login=(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.LoginReq());
    await axios
    .post("http://localhost:4000/api/auth/login",data,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.LoginSuccess(res.data));
    })
    .catch((error)=>{
        dispatch(authSlice.actions.LoginFail(error.response.data.error));
    })
}
export const logout=()=>async(dispatch)=>{
     dispatch(authSlice.actions.logoutReq());
    await axios
    .get("http://localhost:4000/api/auth/logout",{
        withCredentials:true,
    })
    .then((res)=>{
        dispatch(authSlice.actions.LogoutSuccess(res.data.message));
        dispatch(authSlice.actions.resetAuthSlice());
    })
    .catch((error)=>{
        dispatch(authSlice.actions.LogoutFail(error.response.data.error));
    })
}
export const getUser=()=>async(dispatch)=>{
     dispatch(authSlice.actions.getUserReq());
    await axios
    .get("http://localhost:4000/api/auth/me",{
        withCredentials:true,
    })
    .then((res)=>{
        dispatch(authSlice.actions.getUserSuccess(res.data));
    })
    .catch((error)=>{
        dispatch(authSlice.actions.getUserFail(error.response.data.message));
    })
}
export const forgotPassword=(email)=>async(dispatch)=>{
    dispatch(authSlice.actions.ForgotPasswordReq());
    await axios
    .post("http://localhost:4000/api/auth/password/forgot",{email},{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.ForgotPasswordSuccess(res.data.message));
    })
    .catch((error)=>{
        dispatch(authSlice.actions.ForgotPasswordFail(error.response.data.error));
    })
}
export const resetPassword=(data,token)=>async(dispatch)=>{
    dispatch(authSlice.actions.ResetPasswordReq());
    await axios
    .put(`http://localhost:4000/api/auth/password/reset/${token}`,data,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.ResetPasswordSuccess(res.data.message));
    })
    .catch((error)=>{
        dispatch(authSlice.actions.ResetPasswordFail(error.response.data.error));
    })
}
export const UpdatePassword=(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.UpdatePasswordReq());
    await axios
    .put(`http://localhost:4000/api/auth/password/update`,{data},{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        },
    })
    .then((res)=>{
        dispatch(authSlice.actions.UpdatePasswordSuccess(res.data.message));
    })
    .catch((error)=>{
        dispatch(authSlice.actions.UpdatePasswordFail(error.response.data.message));
    })
}

export default authSlice.reducer;