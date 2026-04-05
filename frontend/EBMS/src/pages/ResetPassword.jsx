import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { token } = useParams();
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);
  const handleResetPassword = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("password", password);
    data.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(data, token));
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
  }, [dispatch, isAuthenticated, message, error, loading]);
  if (isAuthenticated) {
    return <Navigate to={"/login"} />
  }
  return <>
    <div className="flex flex-col md:flex-row h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-black text-white flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src={logo_with_title} alt="logo" className="h-44 w-auto" />
          </div>
          <h3 className="text-gray-300 max-w-[320px] mx-auto text-2xl font-medium leading-8">
            "Digital makes it easier to record"
          </h3>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">

        {/* Back Button */}
        <Link
          to={"/password/forgot"}
          className="border-2 border-black text-black rounded-3xl font-bold px-4 py-2 absolute top-6 left-6 hover:bg-black hover:text-white transition duration-200"
        >
          Back
        </Link>

        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-20 w-auto" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-semibold text-center mb-3">
            Reset Password
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Enter your new password
          </p>

          {/* Form */}
          <form onSubmit={handleResetPassword}>

            <div className="mb-4">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
              />
            </div>

            <div className="mb-6">
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className={"w-full py-3 rounded-xl font-semibold transition-colors duration-200 border-2 border-black bg-black text-white hover:bg-white hover:text-black "}
              disabled={loading ? true : false}>
              Reset Password
            </button>

          </form>
        </div>
      </div>

    </div>
  </>;
};

export default ResetPassword;
