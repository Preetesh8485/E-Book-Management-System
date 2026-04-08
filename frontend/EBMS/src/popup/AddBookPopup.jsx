import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popupSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

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
    dispatch(addBook(formData));
    dispatch(fetchAllBooks());
    dispatch(toggleAddBookPopup());
  };

  return <>
    <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Record Book</h3>

          <form onSubmit={handleAddBook}>
            <div className="mb-4">
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
              <textarea value={description} onChange={(e)=>{setDescription(e.target.value)}} placeholder="About Book" rows={4} className="w-full px-4 py-2 border border-black rounded-md"/>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" type="button" onClick={() => { dispatch(toggleAddBookPopup()) }}>
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
  </>;
};

export default AddBookPopup;