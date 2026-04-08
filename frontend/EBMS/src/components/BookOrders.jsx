import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, markOrderDelivered } from "../store/slices/OrderSlice";
import Header from "../layout/Header";
import {toggleOrderBookPopup} from "../store/slices/popupSlice"
import AddNewOrderPopup from "../popup/AddNewOrderPopup";
const BookOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.order);
const { OrderBookPopup } = useSelector(state => state.popup);
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()} 
    ${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />

      {/* Heading */}
      <div className="flex items-center justify-between mt-4">
  <h1 className="text-xl font-medium md:text-2xl md:font-semibold mb-12">
    Book Orders
  </h1>

  <button
    onClick={() => dispatch(toggleOrderBookPopup())}
    className="px-4 py-2 border-black border-2 bg-black text-white rounded-md hover:bg-white hover:text-black hover:cursor-pointer transition duration-200"
  >
    + Create Order
  </button>
</div>
      {/* Content */}
      {loading ? (
        <h2 className="mt-6">Loading...</h2>
      ) : orders && orders.length > 0 ? (
        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg" style={{ overflow: "auto" }}>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">ISBN</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Invoice</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Date</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="px-4 py-2">{index + 1}</td>

                  <td className="px-4 py-2">{order.title}</td>
                  <td className="px-4 py-2">{order.author}</td>
                  <td className="px-4 py-2">{order.ISBN}</td>
                  <td className="px-4 py-2">{order.seller}</td>
                  <td className="px-4 py-2">{order.invoiceID}</td>

                  <td className="px-4 py-2 text-center">
                    {order.quantity}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        order.OrderDelivery === "Delivered"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {order.OrderDelivery}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {order.OrderDelivery === "Pending" && (
                      <button
                        onClick={() =>
                          dispatch(markOrderDelivered(order._id))
                        }
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
    </main>
  );
};

export default BookOrders;