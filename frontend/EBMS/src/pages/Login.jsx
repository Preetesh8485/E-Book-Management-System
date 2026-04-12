import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
  }
  useEffect(() => {
    // if (message) {
    //   toast.success(message);
    //   dispatch(resetAuthSlice());
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
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>
          </div>
          <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">Welcome to EBMS</h1>
          <p className=" text-gray-800 text-center mb-12 ">Please enter credentials to login</p>
          <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto">
            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter registered Email"
                className="w-full px-4 py-3 text-center text-lg font-semibold border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
              /></div>
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 text-center text-lg font-semibold border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
              />

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Link to={"/password/forgot"} className="font-semibold text-black mb-12">Forgot Password?</Link>
            <div className="block md:hidden font-semibold mt-5">
              <p>Not registered yet ?<Link to={"/register"} className="text-sm text-gray-600 hover:underline">Sign Up</Link></p>
            </div>



            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 border-2 border-black flex items-center justify-center gap-2
  ${loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-white hover:text-black"
                }`}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </>
              ) : (
                "SIGN IN"
              )}
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

export default Login;
