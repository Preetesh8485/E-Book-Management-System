import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";
import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
} from "../store/slices/popupSlice.js";

import SettingPopup from "../popup/SettingPopup.jsx";
import AddNewAdmin from "../popup/AddNewAdmin";

const SideBar = ({
  isSideBarOpen,
  setIsSideBarOpen,
  setSelectedComponent,
}) => {
  const dispatch = useDispatch();

  const { addNewAdminPopup, settingPopup } = useSelector(
    (state) => state.popup
  );

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, loading, error, message]);

  // Design utility for hover and transition
  const btnStyle = "w-full py-2 px-4 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 hover:bg-white/10 cursor-pointer";

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-gradient-to-b from-[#0047AB] to-[#003580] text-amber-50 flex-col h-full shadow-xl`}
        style={{ position: "fixed" }}
      >
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            className={btnStyle}
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>

          <button
            className={btnStyle}
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>

          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className={btnStyle}
                onClick={() => setSelectedComponent("Catalog")}
              >
                <img src={catalogIcon} alt="icon" />
                <span>Catalog</span>
              </button>

              <button
                className={btnStyle}
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={usersIcon} alt="icon" />
                <span>Users</span>
              </button>

              <button
                className={btnStyle}
                onClick={() => setSelectedComponent("Order Book")}
              >
                <img src={bookIcon} alt="icon" />
                <span>Order Book</span>
              </button>

              <button
                className={btnStyle}
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add new admin</span>
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "Member" && (
            <button
              className={btnStyle}
              onClick={() =>
                setSelectedComponent("My Borrowed Books")
              }
            >
              <img src={catalogIcon} alt="icon" />
              <span>My Borrowed Books</span>
            </button>
          )}

          <button
            className={btnStyle}
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" />
            <span>Update Credentials</span>
          </button>
        </nav>

        <div className="px-6 py-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full py-2 font-medium flex items-center justify-center space-x-5 transition-all duration-300 hover:bg-red-800 rounded-xl cursor-pointer"
          >
            <img src={logoutIcon} alt="icon" />
            <span>Log Out</span>
          </button>
        </div>

        <img
          src={closeIcon}
          alt="icon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="absolute top-0 right-0 mt-4 md:hidden px-2 cursor-pointer"
        />
      </aside>

      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;