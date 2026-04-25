import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import Header from "../layout/Header";
import { Pie, Bar } from "react-chartjs-2"; 
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
  const { orders } = useSelector((state) => state.order);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const { settingPopup } = useSelector((state) => state.popup);
  const [totalUsers, setTotalUsers] = useState(0);
  const [TotalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState((books && books.length) || 0);

  useEffect(() => {
    setTotalBooks(books?.length || 0);
  }, [books]);

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
    let numberOfUser = users.filter((user) => user.role === "Member");
    let numberOfAdmin = users.filter((user) => user.role === "Admin");

    setTotalUsers(numberOfUser.length);
    setTotalAdmin(numberOfAdmin.length);

    let totalBBooks = allBorrowedBooks.filter((book) => book.returnDate === null);
    let totalRBooks = allBorrowedBooks.filter((book) => book.returnDate !== null);

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
      },
    ],
  };

  const totalPendingOrders = orders.filter(
    (order) => order.OrderDelivery === "Pending"
  ).length;

  const barChartData = {
    labels: ["Members", "Admins", "Pending Tasks"],
    datasets: [
      {
        label: "Management Metrics",
        data: [totalUsers, TotalAdmin, totalPendingOrders],
        backgroundColor: ["#00A7E1", "#1F2937", "#FFA630"],
        borderRadius: 4,
      },
    ],
  };

  // Logic to only fetch the latest 5 registered "Members"
  const recentMembers = users
    .filter((u) => u.role === "Member")
    .slice(-5) // Get the last 5 from the array
    .reverse(); // Reverse so newest is on top

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Section 1: Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Total Members</p>
              <h3 className="text-3xl font-black">{totalUsers}</h3>
            </div>
            <img src={usersIcon} alt="users Icon" className="w-10 h-10 opacity-20" />
          </div>

          <div className="bg-white p-5 rounded-lg flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Library Collection</p>
              <h3 className="text-3xl font-black">{totalBooks}</h3>
            </div>
            <img src={bookIcon} alt="book Icon" className="w-10 h-10 opacity-20" />
          </div>

          <div className="bg-white p-5 rounded-lg flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">System Admins</p>
              <h3 className="text-3xl font-black">{TotalAdmin}</h3>
            </div>
            <img src={usersIcon} alt="users Icon" className="w-10 h-10 opacity-20" />
          </div>

          <div className="bg-white p-5 rounded-lg flex items-center justify-between shadow-sm border-b-4 border-[#FFA630]">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Pending Orders</p>
              <h3 className="text-3xl font-black">{totalPendingOrders}</h3>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[#FFA630]">!</div>
          </div>
        </div>

        {/* Section 2: Distribution & Recent Members */}
        <div className="flex flex-col xl:flex-row gap-7 mb-8">
          <div className="flex-1 bg-white p-8 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Circulation & New Members</h4>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Live Metrics</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Chart Block */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-50">
                  <Pie data={data} options={{ cutout: 70, plugins: { legend: { display: false } } }} />
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Borrowed</p>
                    <p className="text-lg font-black text-[#FFA630]">{totalBorrowedBooks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Returned</p>
                    <p className="text-lg font-black text-[#00A7E1]">{totalReturnedBooks}</p>
                  </div>
                </div>
              </div>

              {/* Recent Members List */}
              <div className="border-l border-gray-100 pl-8">
                <h5 className="text-[11px] font-black text-gray-400 uppercase mb-4 tracking-tighter">Recently Registered</h5>
                <div className="flex flex-col gap-3">
                  {recentMembers.map((m, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 overflow-hidden">
                        {m.avatar?.url ? <img src={m.avatar.url} alt={m.name} className="object-cover h-full w-full" /> : m.name.charAt(0)}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-gray-800 leading-none truncate">{m.name}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-medium">{m.role}</span>
                      </div>
                    </div>
                  ))}
                  {recentMembers.length === 0 && <p className="text-xs text-gray-400 italic">No recent members found</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Identity Card */}
          <div className="xl:w-100 bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <img 
                src={user && user.avatar?.url} 
                alt="avatar" 
                className="rounded-full w-28 h-28 object-cover border-4 border-gray-50 shadow-md" 
              />
              <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-black text-gray-800">{user && user.name}</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">Active Library Admin</p>
            </div>
            <img src={logo} alt="logo" className="w-24 opacity-40" />
          </div>
        </div>

        {/* Section 3: System Performance Overview */}
        <div className="bg-white p-8 rounded-lg shadow-sm border-t-8 border-[#00A7E1]">
          <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest mb-6">System Capacity Overview</h4>
          <div className="h-48">
            <Bar 
              data={barChartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                    x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;