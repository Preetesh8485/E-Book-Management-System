import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import Header from "../layout/Header";
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
import logo from "../assets/black-logo.png";
import { useSelector } from "react-redux";

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

const UserDashboard = () => {
  const { userBorrowedBooks } = useSelector(state => state.borrow);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);
  useEffect(() => {
    let totalBBooks = userBorrowedBooks.filter((book) => book.returned === false);
    let totalRBooks = userBorrowedBooks.filter((book) => book.returned === true);
    setTotalBorrowedBooks(totalBBooks.length);
    setTotalReturnedBooks(totalRBooks.length);
  }, [userBorrowedBooks]);
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
  return <>
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      <div className="flex flex-col-reverse xl:flex-row">
        <div className="flex flex-4 flex-col gap-7 lg:gap-7 lg:py-5 justify-between xl:min-h-[85.5vh]">

          <div className="flex flex-col gap-7 flex-4">

            <div className="flex flex-col lg:flow-row gap-7 overflow-y-hidden">

              {/* Borrowed Books */}
              <div className="flex items-center gap-3 bg-white p-5 min-h-30 overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300">
                <span className="w-0.5 bg-black h-20 lg:h-full"></span>

                <span className="bg-gray-300 h-20 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                  <img src={bookIcon} alt="book-icon" className="w-8 h-8" />
                </span>

                {/* Only this wrapper is added to push the count to the right */}
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-lg xl:text-xl font-semibold">
                    Your Borrowed Book List
                  </p>

                  {/* The small count box */}
                  <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-1 rounded-lg border border-gray-200 min-w-[60px]">
                    <span className="text-[10px] uppercase text-gray-500 font-bold">Total</span>
                    <span className="text-xl font-bold text-black">{totalBorrowedBooks}</span>
                  </div>
                </div>
              </div>

              {/* Returned Books */}
              <div className="flex items-center gap-3 bg-white p-5 min-h-30 overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300">
                <span className="w-0.5 bg-black h-20 lg:h-full"></span>

                <span className="bg-gray-300 h-20 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                  <img src={returnIcon} alt="book-icon" className="w-8 h-8" />
                </span>

                <div className="flex flex-1 items-center justify-between">
                  <p className="text-lg xl:text-xl font-semibold">
                    Your Returned Book List
                  </p>

                  {/* The small count box */}
                  <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-1 rounded-lg border border-gray-200 min-w-15">
                    <span className="text-[10px] uppercase text-gray-500 font-bold">Total</span>
                    <span className="text-xl font-bold text-black">{totalReturnedBooks}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row gap-7">

              {/* Browse Books */}
              <div className="flex items-center gap-3 bg-white p-5 max-h-30 overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300">
                <span className="w-0.5 bg-black h-20 lg:h-full"></span>

                <span className="bg-gray-300 h-20 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                  <img src={browseIcon} alt="book-icon" className="w-8 h-8" />
                </span>

                <p className="text-lg xl:text-xl font-semibold">
                  Let's browse books inventory
                </p>
              </div>

              <img
                src={logo_with_title}
                alt="logo"
                className="hidden lg:block w-auto justify-end"
              />
            </div>
          </div>

          {/* Footer Card */}
          <div className="bg-white p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative flex-[3] flex justify-center items-center rounded-2xl">
            <h4 className="overflow-y-hidden">"Digitizing knowledge, simplifying discovery."</h4>

            <p className="text-gray-700 text-sm sm:text-lg absolute right-8.75 sm:right-19.5 bottom-2.5">
              ~ Digital Library Team
            </p>
          </div>

        </div>





        {/*Right side*/}
        <div className="flex-2 flex-col gap-7 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-20 py-5">
          <div className="xl:flex-4 flex items-end w-full content-center">
            <Pie
              data={data}
              options={{ cutout: 0 }}
              className="mx-auto lg:mx-0 w-full h-auto"
            />
          </div>

          <div className="flex items-center p-8 w-full sm:w-100 xl:w-fit mr-5 xl:p-3 2xl:p-6 gap-5 h-fit xl:min-h-37.5 bg-white xl:flex-1 rounded-lg">
            <img src={logo} alt="logo" className="w-auto h-12 2xl:h-20 " />
            <span className="w-0.5 bg-black h-full"></span>
            <div className=" flex flex-col gap-5">
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
      </div>
    </main>
  </>;
};

export default UserDashboard;
