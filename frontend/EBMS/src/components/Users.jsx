import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import { deleteUser, fetchAllUsers } from "../store/slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.user);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const res = dispatch(deleteUser(id));

    if (!res.error) {
      dispatch(fetchAllUsers());
    }
  };
  // 🔥 Filter logic
  const filteredUsers = users
    ?.filter(u => u.role === "Member")
    ?.filter(user => {
      const query = search.toLowerCase();

      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        String(user.regdno).includes(query) ||
        formatDate(user.createdAt).toLowerCase().includes(query)
      );
    });
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const hasOverdue = (user) => {
    const now = new Date();
    return user.borrowedBooks?.some(book =>
      new Date(book.dueDate) < now && !book.returned
    );
  };
  return (
    <>
      <main className="relative flex-1 p-6 pt-28 ">
        <Header />

        {/* Sub header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Users
          </h2>

          {/* 🔥 Search Bar */}
          <input
            type="text"
            placeholder="Search by name, email, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md outline-none w-full md:w-72"
          />
        </header>

        {/* Table */}
        {filteredUsers && filteredUsers.length > 0 ? (
          <>
            <div
              className="mt-6 overflow-auto bg-white rounded-md shadow-lg"
              style={{ overflow: "auto" }}
            >
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Regdno</th>
                    <th className="px-4 py-2 text-center">
                      Borrowed Books quantity
                    </th>
                    <th className="px-4 py-2 text-center">Registered On</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{user.regdno}</td>
                      <td className="px-4 py-2 text-center">
                        {user?.borrowedBooks.length}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          disabled={hasOverdue(user)}
                          onClick={() => handleDeleteUser(user._id)}
                          className={`px-3 py-1 text-sm text-white rounded ${hasOverdue(user)
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔥 Pagination (NO CSS CHANGED) */}
            <div className="flex justify-between items-center mt-4">
              <span>
                Showing {indexOfFirstUser + 1}–
                {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                {filteredUsers.length}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={indexOfLastUser >= filteredUsers.length}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No matching users found.
          </h3>
        )}
      </main>
    </>
  );
};

export default Users;