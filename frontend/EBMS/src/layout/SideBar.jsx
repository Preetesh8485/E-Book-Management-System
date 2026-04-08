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
import AddNewAdmin from "../popup/AddNewAdmin"; // ✅ FIXED IMPORT

const SideBar = ({
  isSideBarOpen,
  setIsSideBarOpen,
  setSelectedComponent,
}) => {
  const dispatch = useDispatch();

  // ✅ FIXED naming (no conflict with component)
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

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-amber-50 flex-col h-full`}
        style={{ position: "fixed" }}
      >
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>

          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>

          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("Catalog")}
              >
                <img src={catalogIcon} alt="icon" />
                <span>Catalog</span>
              </button>

              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={usersIcon} alt="icon" />
                <span>Users</span>
              </button>

              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("Order Book")}
              >
                <img src={bookIcon} alt="icon" />
                <span>Order Book</span>
              </button>

              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add new admin</span>
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "Member" && (
            <button
              className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
              onClick={() =>
                setSelectedComponent("My Borrowed Books")
              }
            >
              <img src={catalogIcon} alt="icon" />
              <span>My Borrowed Books</span>
            </button>
          )}

          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" />
            <span>Update Credentials</span>
          </button>
        </nav>

        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="py-2 font-medium flex items-center justify-center space-x-5 mx-auto hover:cursor-pointer"
          >
            <img src={logoutIcon} alt="icon" />
            <span>Log Out</span>
          </button>
        </div>

        <img
          src={closeIcon}
          alt="icon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="absolute top-0 right-0 mt-4 md:hidden px-2 hover:cursor-pointer"
        />
      </aside>

      {/* ✅ FIXED POPUPS */}
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;