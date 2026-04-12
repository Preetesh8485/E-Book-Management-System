import React from "react";
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
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const safeBorrowedBooks = userBorrowedBooks || [];
  
  // Derived state for counts
  const totalBorrowedBooks = safeBorrowedBooks.filter((book) => !book.returned).length;
  const totalReturnedBooks = safeBorrowedBooks.filter((book) => book.returned).length;

  const data = {
    labels: ["Total Borrowed Book", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#FFA630", "#00A7E1"],
        hoverOffset: 4,
      }
    ]
  };

  return (
    <>
      {/* Reduced pt-28 to pt-20 to reclaim top space */}
      <main className="relative flex-1 p-6 pt-20">
        <Header />
        <div className="flex flex-col-reverse xl:flex-row">
          {/* Reduced gap-7 to gap-4 and adjusted min-h for 100% zoom fit */}
          <div className="flex flex-4 flex-col gap-4 lg:py-5 justify-between xl:min-h-[82vh]">

            <div className="flex flex-col gap-4 flex-4">

              <div className="flex flex-col lg:flow-row gap-4 overflow-y-hidden">

                {/* Borrowed Books - Adjusted p-5 to p-4 */}
                <div className="flex items-center gap-3 bg-white p-4 min-h-28 overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300">
                  <span className="w-0.5 bg-black h-16 lg:h-full"></span>

                  <span className="bg-gray-300 h-16 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                    <img src={bookIcon} alt="book-icon" className="w-8 h-8" />
                  </span>

                  <div className="flex flex-1 items-center justify-between">
                    <p className="text-lg xl:text-xl font-semibold">
                      Your Borrowed Book List
                    </p>

                    <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-1 rounded-lg border border-gray-200 min-w-[60px]">
                      <span className="text-[10px] uppercase text-gray-500 font-bold">Total</span>
                      <span className="text-xl font-bold text-black">{totalBorrowedBooks}</span>
                    </div>
                  </div>
                </div>

                {/* Returned Books - Adjusted p-5 to p-4 */}
                <div className="flex items-center gap-3 bg-white p-4 min-h-28 overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300">
                  <span className="w-0.5 bg-black h-16 lg:h-full"></span>

                  <span className="bg-gray-300 h-16 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                    <img src={returnIcon} alt="book-icon" className="w-8 h-8" />
                  </span>

                  <div className="flex flex-1 items-center justify-between">
                    <p className="text-lg xl:text-xl font-semibold">
                      Your Returned Book List
                    </p>

                    <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-1 rounded-lg border border-gray-200 min-w-15">
                      <span className="text-[10px] uppercase text-gray-500 font-bold">Total</span>
                      <span className="text-xl font-bold text-black">{totalReturnedBooks}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Section - Reduced gap to 4 */}
              <div className="flex flex-col lg:flex-row gap-4">

                <div className="flex items-center gap-3 bg-white p-4 max-h-28 overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300">
                  <span className="w-0.5 bg-black h-16 lg:h-full"></span>

                  <span className="bg-gray-300 h-16 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                    <img src={browseIcon} alt="book-icon" className="w-8 h-8" />
                  </span>

                  <p className="text-lg xl:text-xl font-semibold">
                    Let's browse books inventory
                  </p>
                </div>

                <img
                  src={logo_with_title}
                  alt="logo"
                  className="hidden lg:block w-auto justify-end h-24"
                />
              </div>
            </div>

            {/* Footer Card - Tightened min-height */}
            <div className="bg-white p-6 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-40 font-semibold relative flex-[3] flex justify-center items-center rounded-2xl">
              <h4 className="overflow-y-hidden text-center">"Digitizing knowledge, simplifying discovery."</h4>

              <p className="text-gray-700 text-sm sm:text-lg absolute right-8 bottom-2">
                ~ Digital Library Team
              </p>
            </div>

          </div>

          {/* Right side - Tightened gaps */}
          <div className="flex-2 flex-col gap-4 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-10 py-5">
            <div className="xl:flex-4 flex items-end w-full content-center">
              <Pie
                data={data}
                options={{ cutout: 0 }}
                className="mx-auto lg:mx-0 w-full max-h-64 h-auto"
              />
            </div>

            <div className="flex items-center p-6 w-full sm:w-100 xl:w-fit mr-5 xl:p-4 gap-5 h-fit bg-white xl:flex-1 rounded-lg">
              <img src={logo} alt="logo" className="w-auto h-12 2xl:h-16" />
              <span className="w-0.5 bg-black h-full"></span>
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#FFA630]"></span>
                  <span className="text-sm font-medium">Total Borrowed Books</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#00A7E1]"></span>
                  <span className="text-sm font-medium">Total Returned Books</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;