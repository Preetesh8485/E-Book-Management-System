import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../store/slices/OrderSlice";
import { toggleOrderBookPopup } from "../store/slices/popupSlice";
import closeIcon from "../assets/close-square.png";

const AddNewOrderPopup = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.order);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setAnimate(true), 10);
        return () => clearTimeout(t);
    }, []);
    const handleClose = () => {
        setAnimate(false);
        setTimeout(() => {
            dispatch(toggleOrderBookPopup());
        }, 300);
    };
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [ISBN, setISBN] = useState("");
    const [seller, setSeller] = useState("");
    const [invoiceID, setInvoiceID] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(
            createOrder({
                title,
                author,
                ISBN,
                seller,
                invoiceID,
                quantity,
            })
        );

        dispatch(toggleOrderBookPopup()); // close popup
    };

    return (<>
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* 🔥 ADD THIS (background layer) */}
            <div
                onClick={handleClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></div>

            {/* ✅ KEEP YOUR ORIGINAL CODE */}
            <div
                className={`w-full bg-white rounded-lg shadow-lg md:w-1/3 relative transform transition-all duration-300 ${animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
            >
                <div className="p-6">

                    {/* Header */}
                    <header className="flex justify-between items-center mb-7 pb-5 border-b border-black">
                        <h3 className="text-lg font-semibold">Create Order</h3>

                        <img
                            src={closeIcon}
                            alt="close"
                            className="cursor-pointer"
                            onClick={handleClose}
                        />
                    </header>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label className="block text-gray-900 font-medium">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Book Title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-900 font-medium">Author</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Book Author"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-900 font-medium">ISBN</label>
                            <input
                                type="text"
                                value={ISBN}
                                onChange={(e) => setISBN(e.target.value)}
                                placeholder="Book ISBN"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-900 font-medium">Seller</label>
                            <input
                                type="text"
                                value={seller}
                                onChange={(e) => setSeller(e.target.value)}
                                placeholder="Seller Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-900 font-medium">Invoice ID</label>
                            <input
                                type="text"
                                value={invoiceID}
                                onChange={(e) => setInvoiceID(e.target.value)}
                                placeholder="Invoice ID"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" required
                            />
                        </div>

                        {/* Quantity (your custom format) */}
                        <div className="mb-4">
                            <label className="block text-gray-900 font-medium">Quantity</label>

                            <div className="flex items-center justify-start gap-2 mt-2">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(Math.max(1, Number(e.target.value)))
                                    }
                                    className="w-16 text-center px-2 py-1 border border-gray-300 rounded-md" required
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    +
                                </button>


                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                CLOSE
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-black text-white hover:bg-gray-600 rounded-md"
                            >
                                {loading ? "CREATING..." : "ADD"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </>
    );
};

export default AddNewOrderPopup;