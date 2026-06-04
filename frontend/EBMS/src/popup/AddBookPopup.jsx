import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook, fetchAllBooks, generateBookMetadata } from "../store/slices/bookSlice";
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
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setShow(false);
    // Wait for transition to finish before unmounting
    setTimeout(() => {
      dispatch(toggleAddBookPopup());
    }, 300);
  };
  const {
    metadata,
    metadataLoading,
  } = useSelector(
    (state) => state.book
  );
  const handleGenerateMetadata = () => {

    if (
      !title.trim() ||
      !author.trim() ||
      !description.trim()
    ) {
      return;
    }

    dispatch(
      generateBookMetadata({
        title,
        author,
        description,
      })
    );

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
    if (metadata) {

      formData.append(
        "genre",
        JSON.stringify(metadata.genre || [])
      );

      formData.append(
        "tags",
        JSON.stringify(metadata.tags || [])
      );

      formData.append(
        "moodTags",
        JSON.stringify(metadata.moodTags || [])
      );

      formData.append(
        "difficultyLevel",
        metadata.difficultyLevel || ""
      );

      formData.append(
        "language",
        metadata.language || "English"
      );

      formData.append(
        "publishYear",
        metadata.publishYear || ""
      );

      formData.append(
        "aiSummary",
        metadata.aiSummary || ""
      );

      formData.append(
        "criticSummary",
        metadata.criticSummary || ""
      );
    }

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
                <label className="block text-gray-900 font-medium mb-2">
                  Book Image
                </label>

                <div className="relative w-full">

                  <input
                    type="file"
                    accept="image/*"
                    id="bookImage"
                    onChange={(e) =>
                      setImage(e.target.files[0])
                    }
                    className="hidden"
                  />

                  <label
                    htmlFor="bookImage"
                    className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-black hover:bg-gray-50 transition-all text-sm font-medium text-gray-500"
                  >
                    {
                      image
                        ? image.name
                        : "Click to upload book cover"
                    }
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
                {metadata && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-100 space-y-4">

                    <h4 className="font-bold text-lg">
                      AI Generated Metadata
                    </h4>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="font-semibold">
                          Difficulty
                        </p>
                        <p>
                          {metadata.difficultyLevel}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="font-semibold">
                          Language
                        </p>
                        <p>
                          {metadata.language}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="font-semibold">
                          Publish Year
                        </p>
                        <p>
                          {metadata.publishYear || "Unknown"}
                        </p>
                      </div>

                    </div>

                    <div>
                      <p className="font-semibold">
                        Genres
                      </p>

                      <div className="flex flex-wrap gap-2 mt-1">
                        {metadata.genre?.map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Tags
                      </p>

                      <div className="flex flex-wrap gap-2 mt-1">
                        {metadata.tags?.map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Mood Tags
                      </p>

                      <div className="flex flex-wrap gap-2 mt-1">
                        {metadata.moodTags?.map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-1">
                        AI Summary
                      </p>

                      <div className="bg-white p-3 rounded shadow-sm text-sm">
                        {metadata.aiSummary}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-1">
                        Critic Summary
                      </p>

                      <div className="bg-white p-3 rounded shadow-sm text-sm">
                        {metadata.criticSummary}
                      </div>
                    </div>

                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-1 mt-4">
                <button
                  type="button"
                  onClick={handleGenerateMetadata}
                  disabled={metadataLoading}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {metadataLoading ? "Generating..." : "Generate Metadata"}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
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