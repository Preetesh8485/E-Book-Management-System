import React from "react";
import { Pie } from "react-chartjs-2";
import Header from "../layout/Header";
import { Book, RotateCcw, Clock, BookOpenCheck, Flame, CalendarDays } from "lucide-react";
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
  
  const returnedBooks = safeBorrowedBooks.filter((book) => book.returned === true);
  const nonReturnedBooks = safeBorrowedBooks.filter((book) => book.returned === false);

  const totalBorrowedBooks = nonReturnedBooks.length;
  const totalReturnedBooks = returnedBooks.length;

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const data = {
    labels: ["Active Loans", "Returned"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#FFA630", "#00A7E1"],
        hoverOffset: 10,
        borderWidth: 0,
      }
    ]
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-24 bg-gray-200 min-h-screen flex flex-col items-center overflow-y-auto w-full">
        <Header />
        
        <div className="max-w-7xl w-full space-y-6">
          
          {/* Top Section: Information Display Only */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Books to Read</p>
                <h3 className="text-3xl font-black text-gray-900">{totalBorrowedBooks}</h3>
              </div>
              <div className="p-4 bg-orange-50 text-[#FFA630] rounded-xl">
                <Book size={28} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lifetime Returns</p>
                <h3 className="text-3xl font-black text-gray-900">{totalReturnedBooks}</h3>
              </div>
              <div className="p-4 bg-blue-50 text-[#00A7E1] rounded-xl">
                <RotateCcw size={28} />
              </div>
            </div>

            {/* Functional Utility Card: Current Status/Streak */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg">
                  <Flame size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg leading-tight">Reading Status</p>
                  <p className="text-xs text-gray-400">
                    {totalBorrowedBooks > 0 ? "Currently Active" : "No active loans"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-orange-400 tracking-tighter">Active</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Utility Side: Summary & Distribution */}
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                <h4 className="text-gray-900 font-black text-lg mb-8 self-start uppercase tracking-tighter">Library Usage</h4>
                <div className="w-full max-w-[220px] py-4">
                  <Pie 
                    data={data} 
                    options={{ 
                      cutout: '75%',
                      plugins: { legend: { display: false } }
                    }} 
                  />
                </div>
                <div className="w-full space-y-3 mt-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFA630]"></div>
                      <span className="text-sm font-bold text-gray-600">Pending Return</span>
                    </div>
                    <span className="font-black text-gray-900">{totalBorrowedBooks}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00A7E1]"></div>
                      <span className="text-sm font-bold text-gray-600">Successfully Returned</span>
                    </div>
                    <span className="font-black text-gray-900">{totalReturnedBooks}</span>
                  </div>
                </div>
              </div>

              {/* Utility Quick-Check: Due Dates Info */}
              <div className="bg-[#0047AB] p-6 rounded-3xl text-white">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarDays size={20} className="text-blue-200" />
                  <h4 className="font-bold text-sm uppercase tracking-widest">Library Policy</h4>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Ensure all active loans are returned before the specific due dates to maintain your membership standing.
                </p>
              </div>
            </div>

            {/* Functional Data Table: Recent History */}
            <div className="xl:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-gray-900 font-black text-lg uppercase tracking-tighter">Transaction Log</h4>
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <Clock size={20} />
                </div>
              </div>
              
              <div className="space-y-4">
                {safeBorrowedBooks.length > 0 ? (
                  [...safeBorrowedBooks].reverse().slice(0, 6).map((book, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-200"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${book.returned ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                          {book.returned ? <BookOpenCheck size={20} /> : <Book size={20} />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 truncate pr-4">{book.BookTitle || "Library Resource"}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              Borrowed: {formatDate(book.borrowedDate)}
                            </span>
                            {!book.returned && (
                              <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded font-black">
                                ACTIVE LOAN
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] font-black tracking-tighter ${book.returned ? 'text-blue-500' : 'text-orange-500'}`}>
                          {book.returned ? 'COMPLETED' : 'IN PROGRESS'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-gray-400 font-medium italic">No activity recorded in the database.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;