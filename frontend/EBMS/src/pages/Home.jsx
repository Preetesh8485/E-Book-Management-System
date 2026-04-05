import React, { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import SideBar from '../layout/SideBar'
import AdminDashboard from '../components/AdminDashboard'
import UserDashboard from '../components/UserDashboard'
import BookManagement from '../components/BookManagement'
import Users from '../components/Users'
import Catalog from '../components/Catalog'
import MyBorrowedBooks from '../components/MyBorrowedBooks'
import BookOrders from '../components/BookOrders';
const Home = () => {
  const [isSideBarOpen, setisSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />
  }
  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-amber-50">
        <GiHamburgerMenu className="text-2xl" onClick={() => setisSideBarOpen(!isSideBarOpen)} />

      </div>
      <SideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setisSideBarOpen} setSelectedComponent={setSelectedComponent} />
      {
        (
          () => {
            switch (selectedComponent) {
              case "Dashboard":
                return user?.role === "Member" ? (
                  <UserDashboard/>
                ) : (
                  <AdminDashboard/>
                )
                break;
              case "Books":
                return <BookManagement/>;
                break;
              case "Catalog":
                if (user.role === "Admin") {
                  return <Catalog/>
                }
                break;
              case "Users":
                if (user.role === "Admin") {
                  return <Users/>
                }
                break;
              case "My Borrowed Books":
                if (user.role === "Admin") {
                  return <MyBorrowedBooks/>
                }
                break;
              case "Order Book":
                if (user.role === "Admin") {
                  return <BookOrders/>
                }
                break;
              default:
                 return user?.role === "Member" ? (
                  <UserDashboard/>
                ) : (
                  <AdminDashboard/>
                )
                break;
            }
          }
        )()
      }
    </div>

  )
}

export default Home
