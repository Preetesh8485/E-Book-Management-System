import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, markOrderDelivered } from "../store/slices/OrderSlice";
import Header from "../layout/Header";
import { toggleOrderBookPopup } from "../store/slices/popupSlice"
import AddNewOrderPopup from "../popup/AddNewOrderPopup";
import { Search, ShoppingBag, Truck, CheckCircle2, Calendar } from "lucide-react";

const BookOrders = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { orders, loading } = useSelector(state => state.order);
  const usersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const { OrderBookPopup } = useSelector(state => state.popup);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()} 
    ${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  const filteredOrders = orders?.filter(order => {
    const query = search.toLowerCase();
    return (
      order.title?.toLowerCase().includes(query) ||
      order.author?.toLowerCase().includes(query) ||
      order.ISBN?.toLowerCase().includes(query) ||
      order.seller?.toLowerCase().includes(query) ||
      order.invoiceID?.toLowerCase().includes(query) ||
      order.OrderDelivery?.toLowerCase().includes(query) ||
      formatDate(order.createdAt).toLowerCase().includes(query)
    );
  }) || [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />

      {/* Re-styled Heading Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mt-4 mb-10 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-[#FFA630]" size={28} />
            Procurement & Orders
          </h1>
          <p className="text-sm text-gray-400 font-medium">Manage incoming stock and vendor invoices</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA630] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none w-full bg-gray-50 focus:ring-2 focus:ring-[#FFA630]/20 focus:border-[#FFA630] transition-all text-sm"
            />
          </div>
          <button
            onClick={() => dispatch(toggleOrderBookPopup())}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transform active:scale-95 transition-all shadow-md shadow-black/10 w-full sm:w-auto whitespace-nowrap"
          >
            <span>+</span> Create Order
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
           <div className="w-8 h-8 border-4 border-[#FFA630] border-t-transparent rounded-full animate-spin"></div>
           <h2 className="text-gray-400 font-bold uppercase text-xs tracking-widest">Fetching Order Ledger</h2>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Book Information</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Seller / Invoice</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Control</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {currentOrders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-gray-300">
                      {(indexOfFirstUser + index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 line-clamp-1">{order.title}</span>
                        <span className="text-[11px] text-gray-400 font-medium">By {order.author} • ISBN: {order.ISBN}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-700 uppercase">{order.seller}</span>
                        <span className="text-[10px] font-mono text-gray-400">{order.invoiceID}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-black text-gray-700">
                        {order.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        order.OrderDelivery === "Delivered" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-yellow-100 text-yellow-600 animate-pulse"
                      }`}>
                        {order.OrderDelivery === "Delivered" ? <CheckCircle2 size={12} /> : <Truck size={12} />}
                        {order.OrderDelivery}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-gray-600">{formatDate(order.createdAt).split(' ')[0]}</span>
                        <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">Registered</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.OrderDelivery === "Pending" ? (
                        <button
                          onClick={() => dispatch(markOrderDelivered(order._id))}
                          className="px-4 py-1.5 bg-[#00A7E1] text-white text-[11px] font-black uppercase rounded-lg hover:bg-[#0086b6] transition-all shadow-sm active:scale-95"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="text-gray-200" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">No Orders Found</h3>
          <p className="text-sm text-gray-400">Your procurement history is currently empty.</p>
        </div>
      )}

      {OrderBookPopup && <AddNewOrderPopup />}

      {/* Styled Pagination Footer */}
      <div className="flex flex-col gap-4 sm:flex-row justify-between items-center mt-8 px-2">
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          Displaying {filteredOrders.length > 0 ? indexOfFirstUser + 1 : 0} — {Math.min(indexOfLastUser, filteredOrders.length)} of {filteredOrders.length} records
        </span>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-white border border-gray-200 text-gray-700 rounded-xl disabled:opacity-30 hover:border-black transition-all active:scale-90 shadow-sm"
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={indexOfLastUser >= filteredOrders.length}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-white border border-gray-200 text-gray-700 rounded-xl disabled:opacity-30 hover:border-black transition-all active:scale-90 shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
};

export default BookOrders;