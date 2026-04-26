import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popupSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  // Logic for the smooth transition state
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Small delay to ensure the DOM has painted before starting transition
    const timeout = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleClose = () => {
    setShow(false);
    // Wait for transition to finish before unmounting
    setTimeout(() => {
      dispatch(toggleAddBookPopup());
    }, 300);
  };

  const handleAddBook = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("ISBN", ISBN);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("image", image);

    dispatch(addBook(formData));
    dispatch(fetchAllBooks());
    handleClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 p-5 flex items-center justify-center z-50 transition-all duration-300 ease-in-out
        ${show ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"}`}
      >
        <div
          className={`w-full bg-white rounded-lg shadow-lg md:w-1/3 transform transition-all duration-300 ease-in-out
          ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Record Book</h3>

            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <div className="flex flex-col items-center mb-4">

                  {/* Image Preview */}
                  <div className="w-24 h-32 rounded-md overflow-hidden border-2 border-gray-300 mb-2">
                    <img
                      src={preview || "https://via.placeholder.com/100"}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload Button */}
                  <label className="cursor-pointer text-sm font-medium text-[#00A7E1]">
                    Upload Front Page
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setImage(file);
                        setPreview(URL.createObjectURL(file));
                      }}
                      className="hidden"
                    />
                  </label>

                </div>
                <label className="block text-gray-900 font-medium">
                  Book Title
                </label>
                <input type="text" required value={title} onChange={(e) => { setTitle(e.target.value) }} placeholder="Book Title" className="w-full px-4 py-2 border-2 border-black rounded-md" />
                <label className="block text-gray-900 font-medium">
                  Book Author
                </label>
                <input type="text" required value={author} onChange={(e) => { setAuthor(e.target.value) }} placeholder="Book Author Name" className="w-full px-4 py-2 border-2 border-black rounded-md" />
                <label className="block text-gray-900 font-medium">
                  ISBN
                </label>
                <input type="text" required value={ISBN} onChange={(e) => { setISBN(e.target.value) }} placeholder="ISBN Code" className="w-full px-4 py-2 border-2 border-black rounded-md" />
                <label className="block text-gray-900 font-medium">
                  Library Location
                </label>
                <input type="text" required value={location} onChange={(e) => { setLocation(e.target.value) }} placeholder="Library Rack location" className="w-full px-4 py-2 border-2 border-black rounded-md" />
                <label className="block text-gray-900 font-medium">
                  Book Price
                </label>
                <input type="number" required value={price} onChange={(e) => { setPrice(e.target.value) }} placeholder="Book value" className="w-full px-4 py-2 border-2 border-black rounded-md" />
                <label className="block text-gray-900 font-medium">
                  Book Qunatity
                </label>
                <input type="number" required value={quantity} onChange={(e) => { setQuantity(e.target.value) }} placeholder="Book Quantity" className="w-full px-4 py-2 border-2 border-black rounded-md" />
                <label className="block text-gray-900 font-medium">
                  Book Description
                </label>
                <textarea value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder="About Book" rows={4} className="w-full px-4 py-2 border border-black rounded-md" />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  type="button"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBookPopup;