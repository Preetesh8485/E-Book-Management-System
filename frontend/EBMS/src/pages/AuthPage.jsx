import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { login, register, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [regdno, setRegdno] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    if (isLogin) {
      dispatch(login(data));
    } else {
      data.append("name", name);
      data.append("regdno", regdno);
      dispatch(register(data));
    }
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      if (!isLogin) {
        navigateTo(`/otp-verification/${email}`);
      }
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message, isLogin, navigateTo, email]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">

      <div
        className={`hidden md:flex absolute top-0 h-full w-1/2  text-white z-20 transition-all duration-700 ease-in-out flex-col items-center justify-center p-8
          ${isLogin
            ? "left-1/2 rounded-tl-[80px] rounded-bl-[80px] bg-[#1E3A8A]"
            : "left-0 rounded-tr-[80px] rounded-br-[80px] bg-[#FB923C]"
          }`}
      >
        <div className="text-center transition-opacity duration-500">
          <div className="flex justify-center mb-8">
            <img src={logo_with_title} alt="logo" className="h-40 w-auto" />
          </div>
          <p className="text-gray-300 mb-8 max-w-xs mx-auto">
            {isLogin ? "Not registered? Sign up now to get started." : "Already part of the community? Sign in here."}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="border-2 border-white px-12 py-2 rounded-lg font-semibold bg-transparent text-white hover:bg-white hover:text-black transition duration-300"
          >
            {isLogin ? "SIGN UP" : "SIGN IN"}
          </button>
        </div>
      </div>
      <div className="flex h-full w-full relative">
        <div
          className={`absolute inset-0 md:relative md:w-1/2 flex items-center justify-center p-6 transition-all duration-500 z-10 
          ${isLogin
              ? "translate-x-0 opacity-100"
              : "-translate-x-full md:translate-x-0 md:opacity-0 pointer-events-none md:pointer-events-auto"
            }`}
        >
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="logo" className="h-16 md:h-20 w-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-medium text-center overflow-hidden mb-2">Welcome to EBMS</h1>
            <p className="text-gray-600 text-center mb-8">Please enter credentials to login</p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-black rounded-xl  focus:ring focus:ring-black"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-xl focus:ring focus:ring-black"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Link to={"/password/forgot"} className="font-semibold text-black text-sm inline-block">
                Forgot Password?
              </Link>
              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-[#1E3A8A] text-white border-2 border-[#1E3A8A] hover:border-black hover:bg-white hover:text-black transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading && isLogin ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    SIGNING IN...
                  </>
                ) : (
                  "SIGN IN"
                )}
              </button>
              <p className="md:hidden text-center mt-6 font-semibold">
                Not registered?{" "}
                <button type="button" onClick={() => setIsLogin(false)} className="underline">
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>

        <div
          className={`absolute inset-0 md:relative md:w-1/2 flex items-center justify-center p-6 transition-all duration-500 z-10 
          ${!isLogin
              ? "translate-x-0 opacity-100"
              : "translate-x-full md:translate-x-0 md:opacity-0 pointer-events-none md:pointer-events-auto"
            }`}
        >
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="logo" className="h-16 md:h-20 w-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-medium text-center overflow-hidden mb-2">Sign Up</h1>
            <p className="text-gray-600 text-center mb-8">Provide your information to sign up</p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-black rounded-xl focus:ring focus:ring-black"
                required
              />
              <input
                type="number"
                value={regdno}
                onChange={(e) => setRegdno(e.target.value)}
                placeholder="Regd Number"
                className="w-full px-4 py-3 border border-black rounded-xl focus:ring focus:ring-black"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-black rounded-xl focus:ring focus:ring-black"
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-black rounded-xl focus:ring focus:ring-black"
                required
              />
              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-[#FB923C] text-white border-2 border-[#FB923C] hover:border-black hover:bg-white hover:text-black transition-all disabled:bg-gray-400"
              >
                {loading && !isLogin ? "CREATING ACCOUNT..." : "SIGN UP"}
              </button>
              <p className="md:hidden text-center mt-6 font-semibold">
                Already have an account?{" "}
                <button type="button" onClick={() => setIsLogin(true)} className="underline">
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;