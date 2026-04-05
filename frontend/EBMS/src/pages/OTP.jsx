import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { Navigate, useParams, Link } from "react-router-dom";
import { useDispatch ,useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
const OTP = () => {
  const {email} = useParams();
  const[otp,setOtp]=useState("");
  const dispatch= useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  const handleOtpVerification = (e)=>{
    e.preventDefault();
    dispatch(otpVerification(email,otp));
  }
   useEffect(() => {
    // if (message) {
    //   toast.success(message);
    // } 
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);
  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }
  return <>
  <div className="flex flex-col justify-center md:flex-row  h-screen">
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
    <Link to={"/register"} className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-200 text-end">Back</Link>
    <div className="max-w-sm w-full">
      <div className="flex justify-center mb-12">
        <div className="rounded-full flex items-center justify-center">
          <img src={logo} alt="logo" className="h-24 w-auto"/>
        </div>
      </div>
      <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">Check your email Inbox</h1>
      <p className=" text-gray-800 text-center mb-12 ">Please enter the otp to proceed</p>
  <form onSubmit={handleOtpVerification} className="w-full max-w-sm mx-auto">
  <div className="mb-6">
    <input
      type="number"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="Enter 5-digit OTP"
      className="w-full px-4 py-3 text-center text-lg font-semibold border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
    />
  </div>

<button
  type="submit"
  className={`w-full py-3 rounded-xl font-semibold transition-colors duration-200 ${
    otp.length === 5
      ? "border-2 border-black bg-black text-white hover:bg-white hover:text-black"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  Verify OTP
</button>
</form>
    </div>
    </div>


    <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
      <div className="text-center h-100">
        <div className="flex justify-center mb-12">
          <img src={logo_with_title} alt="logo" className=" mb-12 h-44 w-auto" />
        </div>
        <p className="text-gray-300 mb-12">Not registered ? Sign up now.</p>
        <Link to={"/register"} className=" border-2 border-white px-8 w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition duration-300">SIGN UP</Link>
      </div>
    </div>
  </div>
  </>;
};

export default OTP;
