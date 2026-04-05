import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { Link, Navigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email,setEmail]=useState("")
  const dispatch=useDispatch();
  const{loading,error,message,isAuthenticated}=useSelector((state)=>state.auth);
  const handleForgotPassword=(e)=>{
    e.preventDefault();
    dispatch(forgotPassword(email));
  }
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    } 
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated,message ,error, loading]);
  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }
  return <>
  <div className="flex flex-col justify-center md:flex-row h-screen">
    {/* leftsection */}
    <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
    <div className="text-center h-112.5">
      <div className="flex justify-center mb-1 ">
        <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
      </div>
      <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium leading-10">"Digital makes it easier to record"</h3>
    </div>
    </div>
    {/* rigth section */}
    <div className="w-full md:1/2 flex items-center justify-center bg-white p-8 relative">
        <Link to={"/login"} className="border-2 border-black text-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-white hover:text-black transition duration-200 text-end">Back</Link>
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-12 ">
            <div className="rounded-full flex items-center justify-center">
              <img src={logo} alt="logo" className="h-24 w-auto"/>
            </div>
          </div>
          <h1 className="text-4xl font-medium text-center mb-5 overflow-hidden">Forgot Password</h1>
          <p className="text-gray-800 mb-12 text-center ">Enter your registered email</p>
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <input required
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter registered Email"
      className="w-full px-4 py-3 text-center text-lg font-semibold border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
    />
            </div>
            <button
  type="submit"
  className={"w-full py-3 rounded-xl font-semibold transition-colors duration-200 border-2 border-black bg-black text-white hover:bg-white hover:text-black "}
 disabled={loading?true:false}>
  Reset Password
</button>
          </form>
        </div>
    </div>
  </div>
  </>;
};

export default ForgotPassword;
