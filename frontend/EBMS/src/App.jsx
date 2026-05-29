import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import Auth from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchUserBorrowedBooks, fetchAllBorrowedBooks } from "./store/slices/borrowSlice.js";
import { socket } from "./socket.js";

const App = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllBooks());
    if (isAuthenticated && user?.role === "Admin") {
      dispatch(fetchAllUsers());
      dispatch(fetchAllBorrowedBooks());
    }
    if (isAuthenticated && user?.role === "Member") {
      dispatch(fetchUserBorrowedBooks());
    }
  }, [isAuthenticated]);

  useEffect(() => {

    if (isAuthenticated && user) {

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("register", user._id);

      if (user.role === "Admin") {
        socket.emit("joinAdminRoom");
      }
    }

  }, [isAuthenticated, user]);
  useEffect(() => {


    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("reconnect", () => {

      console.log("Socket reconnected");

      if (user?._id) {

        socket.emit("register", user._id);

        if (user.role === "Admin") {
          socket.emit("joinAdminRoom");
        }
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
    };

  }, [user]);
  useEffect(() => {

    if (!isAuthenticated && socket.connected) {
      socket.disconnect();
    }

  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/otp-verification/:email" element={<OTP />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
        </Routes>
        <ToastContainer theme="dark" />
      </Router>
    </>
  );
};

export default App;