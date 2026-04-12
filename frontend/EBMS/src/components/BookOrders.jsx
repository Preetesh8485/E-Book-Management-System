import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, markOrderDelivered } from "../store/slices/OrderSlice";
import Header from "../layout/Header";
import { toggleOrderBookPopup } from "../store/slices/popupSlice"
import AddNewOrderPopup from "../popup/AddNewOrderPopup";

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

  // Reset pagination when searching
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

      {/* Heading - Modified for Responsive Wrap */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4 mb-12">
        <h1 className="text-xl font-medium md:text-2xl md:font-semibold">
          Book Orders
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Search by title, author, ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md outline-none w-full md:w-72"
          />
          <button
            onClick={() => dispatch(toggleOrderBookPopup())}
            className="px-4 py-2 border-black border-2 bg-black text-white rounded-md hover:bg-white hover:text-black hover:cursor-pointer transition duration-200 w-full sm:w-auto whitespace-nowrap"
          >
            + Create Order
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <h2 className="mt-6">Loading...</h2>
      ) : filteredOrders.length > 0 ? (
        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">ISBN</th>
                <th className="px-4 py-2 text-left">Seller</th>
                <th className="px-4 py-2 text-left">Invoice</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Date</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="px-4 py-2">{indexOfFirstUser + index + 1}</td>
                  <td className="px-4 py-2">{order.title}</td>
                  <td className="px-4 py-2">{order.author}</td>
                  <td className="px-4 py-2">{order.ISBN}</td>
                  <td className="px-4 py-2">{order.seller}</td>
                  <td className="px-4 py-2">{order.invoiceID}</td>
                  <td className="px-4 py-2 text-center">{order.quantity}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        order.OrderDelivery === "Delivered" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {order.OrderDelivery}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-2 text-center">
                    {order.OrderDelivery === "Pending" && (
                      <button
                        onClick={() => dispatch(markOrderDelivered(order._id))}
                        className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                      >
                        Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h3 className="text-2xl mt-6">No Orders Found</h3>
      )}

      {OrderBookPopup && <AddNewOrderPopup />}

      {/* Pagination Footer */}
      <div className="flex flex-col gap-4 sm:flex-row justify-between items-center mt-6">
        <span className="text-gray-600">
          Showing {filteredOrders.length > 0 ? indexOfFirstUser + 1 : 0}–
          {Math.min(indexOfLastUser, filteredOrders.length)} of{" "}
          {filteredOrders.length}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-gray-200 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={indexOfLastUser >= filteredOrders.length}
            className="px-4 py-1 bg-gray-200 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
};

export default BookOrders;