import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllRequests,
    approveRequest,
    rejectRequest,
    resetRequestSlice,
} from "../store/slices/requestSlice";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import { BookOpen, Check, X } from "lucide-react";
import { socket } from "../socket.js"
const BookRequests = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { requests, error, message, loading } = useSelector((state) => state.request);
    useEffect(() => {

        // only admin joins admin room
        if (user?.role === "Admin") {
            socket.emit("joinAdminRoom");
        }

        socket.on("newBookRequest", (request) => {

            toast.info(
                `📚 New request: "${request.book?.title}" by ${request.user?.name}`
            );

            dispatch(fetchAllRequests());
        });

        return () => {
            socket.off("newBookRequest");
        };

    }, [dispatch, user]);
    useEffect(() => {
        dispatch(fetchAllRequests());
    }, []);

    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch(fetchAllRequests());
            dispatch(resetRequestSlice());
        }
        else if (error) {
            toast.error(error);
            dispatch(resetRequestSlice());
        }
    }, [message, error, dispatch]);

    return (
        <main className="relative flex-1 p-6 pt-28">
            <Header />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                    <BookOpen className="text-[#00A7E1]" size={26} />
                    Book Requests
                </h1>
                <p className="text-sm text-gray-400">Approve to directly issue the book to the member</p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="overflow-x-auto" style={{ overflow: "auto" }}>
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {["#", "Member", "Regd No", "Book", "Author", "Requested On", "Status", "Actions"].map((h) => (
                                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {requests && requests.length > 0 ? (
                                requests.map((request, index) => (
                                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-300">
                                            {(index + 1).toString().padStart(2, "0")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">{request.user?.name}</span>
                                                <span className="text-xs text-gray-400">{request.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.user?.regdno}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {request.book?.image?.url && (
                                                    <img src={request.book.image.url} className="w-8 h-11 object-cover rounded" />
                                                )}
                                                <span className="text-sm font-semibold text-gray-800">{request.book?.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{request.book?.author || "N/A"}</td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(request.createdAt).toDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase
                        ${request.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                                                    : request.status === "Approved" ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {request.status === "Pending" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={loading}
                                                        onClick={() => dispatch(approveRequest(request._id))}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        <Check size={13} /> Approve & Issue
                                                    </button>
                                                    <button
                                                        disabled={loading}
                                                        onClick={() => dispatch(rejectRequest(request._id))}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        <X size={13} /> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-20 text-center text-gray-400 text-sm">
                                        No book requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default BookRequests;