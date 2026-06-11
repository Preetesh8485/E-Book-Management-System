import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import {
    fetchAllRequests,
    approveRequest,
    rejectRequest,
    resetRequestSlice
} from "../store/slices/requestSlice";
import { toast } from "react-toastify";
import {
    Search,
    BookOpen,
    CheckCircle2,
    XCircle,
    Clock3,
   
} from "lucide-react";

const Requests = () => {
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const requestsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const { allRequests, loading, message, error } = useSelector(
        (state) => state.request
    );

    useEffect(() => {
        dispatch(fetchAllRequests());
    }, [dispatch, message]);
    useEffect(() => {

        if (message) {

            toast.success(message);

            dispatch(resetRequestSlice());
        }

        if (error) {

            toast.error(error);

            dispatch(resetRequestSlice());
        }

    }, [dispatch, message, error]);
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

    const filteredRequests =
        allRequests?.filter((request) => {
            const query = search.toLowerCase();

            return (
                request.user?.name?.toLowerCase().includes(query) ||
                request.user?.email?.toLowerCase().includes(query) ||
                request.book?.title?.toLowerCase().includes(query) ||
                request.status?.toLowerCase().includes(query)
            );
        }) || [];

    const indexOfLastRequest =
        currentPage * requestsPerPage;

    const indexOfFirstRequest =
        indexOfLastRequest - requestsPerPage;

    const currentRequests = filteredRequests.slice(
        indexOfFirstRequest,
        indexOfLastRequest
    );

    return (
        <main className="relative flex-1 p-6 pt-28">
            <Header />

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mt-4 mb-10 border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                        <BookOpen
                            className="text-[#FFA630]"
                            size={28}
                        />
                        Book Requests
                    </h1>

                    <p className="text-sm text-gray-400 font-medium">
                        Manage student book requests
                    </p>
                </div>

                <div className="relative w-full md:w-72 group">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA630] transition-colors"
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none w-full bg-gray-50 focus:ring-2 focus:ring-[#FFA630]/20 focus:border-[#FFA630] transition-all text-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center mt-20 gap-4">
                    <div className="w-8 h-8 border-4 border-[#FFA630] border-t-transparent rounded-full animate-spin"></div>

                    <h2 className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                        Fetching Requests
                    </h2>
                </div>
            ) : filteredRequests.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto" style={{ overflow: "auto" }}>
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        ID
                                    </th>

                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        User
                                    </th>

                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Book
                                    </th>

                                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Requested At
                                    </th>

                                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {currentRequests.map(
                                    (request, index) => (
                                        <tr
                                            key={request._id}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm font-bold text-gray-300">
                                                {(
                                                    indexOfFirstRequest +
                                                    index +
                                                    1
                                                )
                                                    .toString()
                                                    .padStart(2, "0")}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800">
                                                        {request.user?.name}
                                                    </span>

                                                    <span className="text-[11px] text-gray-400 font-medium">
                                                        {request.user?.email}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-gray-700">
                                                    {request.book?.title || "Book Removed From Library"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${request.status ===
                                                            "Approved"
                                                            ? "bg-green-100 text-green-600"
                                                            : request.status ===
                                                                "Rejected"
                                                                ? "bg-red-100 text-red-600"
                                                                : "bg-yellow-100 text-yellow-600 animate-pulse"
                                                        }`}
                                                >
                                                    {request.status ===
                                                        "Approved" ? (
                                                        <CheckCircle2
                                                            size={12}
                                                        />
                                                    ) : request.status ===
                                                        "Rejected" ? (
                                                        <XCircle size={12} />
                                                    ) : (
                                                        <Clock3 size={12} />
                                                    )}

                                                    {request.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[11px] font-bold text-gray-600">
                                                        {
                                                            formatDate(
                                                                request.createdAt
                                                            ).split(" ")[0]
                                                        }
                                                    </span>

                                                    <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">
                                                        Requested
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {request.status ===
                                                    "Pending" ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                dispatch(
                                                                    approveRequest(
                                                                        request._id
                                                                    )
                                                                )
                                                            }
                                                            className="px-4 py-1.5 bg-green-500 text-white text-[11px] font-black uppercase rounded-lg hover:bg-green-600 transition-all shadow-sm active:scale-95"
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                dispatch(
                                                                    rejectRequest(
                                                                        request._id
                                                                    )
                                                                )
                                                            }
                                                            className="px-4 py-1.5 bg-red-500 text-white text-[11px] font-black uppercase rounded-lg hover:bg-red-600 transition-all shadow-sm active:scale-95"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                        Complete
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="mt-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <BookOpen
                            className="text-gray-200"
                            size={40}
                        />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                        No Requests Found
                    </h3>

                    <p className="text-sm text-gray-400">
                        No pending requests available.
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row justify-between items-center mt-8 px-2">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    Displaying{" "}
                    {filteredRequests.length > 0
                        ? indexOfFirstRequest + 1
                        : 0}{" "}
                    —{" "}
                    {Math.min(
                        indexOfLastRequest,
                        filteredRequests.length
                    )}{" "}
                    of {filteredRequests.length} records
                </span>

                <div className="flex gap-3">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => prev - 1)
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-white border border-gray-200 text-gray-700 rounded-xl disabled:opacity-30 hover:border-black transition-all active:scale-90 shadow-sm"
                    >
                        Prev
                    </button>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) => prev + 1)
                        }
                        disabled={
                            indexOfLastRequest >=
                            filteredRequests.length
                        }
                        className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-white border border-gray-200 text-gray-700 rounded-xl disabled:opacity-30 hover:border-black transition-all active:scale-90 shadow-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Requests;