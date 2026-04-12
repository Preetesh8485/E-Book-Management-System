import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import Header from "../layout/Header";
import { Pie } from "react-chartjs-2";
import { getAllOrders } from "../store/slices/OrderSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";

import logo from "../assets/black-logo.png";
import { fetchAllUsers } from "../store/slices/userSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { orders } = useSelector((state) => state.order)
  const { allBorrowedBooks } = useSelector((state) => state.borrow)
  const { settingPopup } = useSelector((state) => state.popup)
  const [totalUsers, setTotalUsers] = useState(0);
  const [TotalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState(books && books.length || 0);
  useEffect(() => {
  setTotalBooks(books?.length || 0);
}, [books])
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);
  const [totalBookOrders, setTotalBookOrders] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(fetchAllUsers());
    dispatch(fetchAllBooks());
  }, [dispatch]);
  useEffect(() => {
  let numberOfUser = users.filter(user => user.role === "Member");
  let numberOfAdmin = users.filter(user => user.role === "Admin");

  setTotalUsers(numberOfUser.length);
  setTotalAdmin(numberOfAdmin.length);

  let totalBBooks = allBorrowedBooks.filter(book => book.returnDate === null);
  let totalRBooks = allBorrowedBooks.filter(book => book.returnDate !== null);

  setTotalBorrowedBooks(totalBBooks.length);
  setTotalReturnedBooks(totalRBooks.length);

  setTotalBookOrders(orders?.length || 0);

}, [users, allBorrowedBooks, orders]);
  const data = {
    labels: ["Total Borrowed Book", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#FFA630", "#00A7E1"],
        hoverOffset: 4,
      }
    ]
  }
  const totalPendingOrders = orders.filter(
    order => order.OrderDelivery === "Pending"
  ).length;
  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      <div className="flex flex-col-reverse xl:flex-row">
        {/*Left side*/}
        <div className=" flex flex-2 flex-col gap-7 lg:flex-row  lg:items-center xl:flex-col justify-between xl:gap-20 py-5">
          <div className="xl:flex-4 flex items-end w-full content-center">
            <Pie data={data} options={{ cutout: 0 }} className="mx-auto lg:mx-0 w-full h-auto" />
          </div>
          <div className="flex flex-1 items-center p-8 w-full sm:w-100 xl:w-fit mr-5 xl:p-3 2xl:p-6 gap-5 h-fit xl:min-h-37.5 bg-white rounded-lg">
            <img src={logo} alt="logo" className="w-auto xl:flex-1 rounded-lg" />
            <span className="w-0.5 bg-black h-full"></span>
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-3">
                <span className=" w-3 h-3 rounded-full bg-[#FFA630]"></span>
                <span>Total Borrowed Books</span>
              </p>
              <p className="flex items-center gap-3">
                <span className=" w-3 h-3 rounded-full bg-[#00A7E1]"></span>
                <span>Total Returned Books</span>
              </p>
            </div>
          </div>

        </div>


        {/*right side*/}
        <div className="flex flex-4 flex-col gap-7 lg:gap-7 lg:py-5 justify-between xl:min-h-[85.5vh]">
          <div className="flex flex-col-reverse lg:flex-row flex-4 gap-7">
            <div className="flex flex-col flex-1 gap-7">
              <div className="flex items-center gap-3 bg-white p-5 max-h-30 overflow-y-hidden rounded-lg transform hover:shadow-inner duration-300 w-full lg:max-w-90">
                <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                  <img src={usersIcon} alt="users Icon" className="w-8 h-8" />
                </span>
                <span className="w-0.5 bg-black h-20 lg:h-full"></span>
                <div className="flex flex-col items-Start gap-2">
                  <h4 className="font-black text-3xl">{totalUsers}</h4>
                  <p className="font-light text-gray-700 text-sm">Total Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-5 max-h-30 overflow-y-hidden rounded-lg transform hover:shadow-inner duration-300 w-full lg:max-w-90">
                <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                  <img src={bookIcon} alt="book Icon" className="w-8 h-8" />
                </span>
                <span className="w-0.5 bg-black h-20 lg:h-full"></span>
                <div className="flex flex-col items-Start gap-2">
                  <h4 className="font-black text-3xl">{totalBooks}</h4>
                  <p className="font-light text-gray-700 text-sm">Total Books in Library</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-5 max-h-30 overflow-y-hidden rounded-lg transform hover:shadow-inner duration-300 w-full lg:max-w-90">
                <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                  <img src={usersIcon} alt="users Icon" className="w-8 h-8" />
                </span>
                <span className="w-0.5 bg-black h-20 lg:h-full"></span>
                <div className="flex flex-col items-Start gap-2">
                  <h4 className="font-black text-3xl">{TotalAdmin}</h4>
                  <p className="font-light text-gray-700 text-sm">Total Admins</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-5 max-h-30 overflow-y-hidden rounded-lg transform hover:shadow-inner duration-300 w-full lg:max-w-90">
                <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg ">
                  <img src={usersIcon} alt="users Icon" className="w-8 h-8" />
                </span>
                <span className="w-0.5 bg-black h-20 lg:h-full"></span>
                <div className="flex flex-col items-Start gap-2">
                  <h4 className="font-black text-3xl">{totalPendingOrders}</h4>
                  <p className="font-light text-gray-700 text-sm ">Total Orders pending</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row flex-1">
              <div className="flex flex-col lg:flex-row flex-1 items-center justify-center">
                <div className="bg-white p-5 rounded-lg shadow-lg h-full flex flex-col justify-center items-center gap-4">
                  <img src={user && user.avatar?.url} alt="avatar" className="rounded-full w-32 h-32 object-cover" />
                  <h2 className="text-xl 2xl:text-2xl font-semibold text-center">{user && user.name}</h2>
                  <p className="text-gray-600 text-sm 2xl:text-base text-center">Welcome Admin! This is your dashbaord to </p>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden xl:flex bg-white text-lg xl:text-3xl 2xl:text-4xl min-h-28 font-semibold relative flex-3 justify-center items-center rounded-2xl">
            <h4 className="overflow-y-hidden">"Digitizing knowledge, simplifying discovery."</h4>
            <p className="text-gray-700 text-sm sm:text-lg absolute right-8.75 sm:right-19.5 bottom-2.5">~ Digital Library Team</p>
          </div>
        </div>
      </div>
    </main>

  </>;
};

export default AdminDashboard;
