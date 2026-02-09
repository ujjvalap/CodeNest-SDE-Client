import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAddAdminEmailMutation,
  useDeleteAdminEmailMutation,
} from "../../redux/api/api";
import { setAuthError } from "../../redux/reducers/authSlice";
import Spinner from "../../shared/Spinner";

/* ---------- Email Validation Helper ---------- */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};

function AdminHeader({ userType, text, fetchUsers }) {
  const dispatch = useDispatch();

  const [addEmail, setAddEmail] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");

  const [addAdminEmail, { isLoading: isLoadingAdd }] =
    useAddAdminEmailMutation();
  const [deleteAdminEmail, { isLoading: isLoadingDel }] =
    useDeleteAdminEmailMutation();

  /* ---------- Handlers ---------- */
  const handleAddAdmin = async () => {
    if (!addEmail.trim()) {
      dispatch(setAuthError("Admin email is required"));
      return;
    }

    if (!isValidEmail(addEmail)) {
      dispatch(setAuthError("Please enter a valid email address"));
      return;
    }

    try {
      await addAdminEmail({ email: addEmail }).unwrap();
      dispatch(setAuthError("Admin email added successfully"));
      setAddEmail("");
      fetchUsers();
    } catch (err) {
      dispatch(
        setAuthError(
          err?.data?.message || err.message || "Failed to add admin"
        )
      );
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deleteEmail.trim()) {
      dispatch(setAuthError("Admin email is required"));
      return;
    }

    if (!isValidEmail(deleteEmail)) {
      dispatch(setAuthError("Please enter a valid email address"));
      return;
    }

    try {
      await deleteAdminEmail({ email: deleteEmail }).unwrap();
      dispatch(setAuthError("Admin email deleted successfully"));
      setDeleteEmail("");
      fetchUsers();
    } catch (err) {
      dispatch(
        setAuthError(
          err?.data?.message || err.message || "Failed to delete admin"
        )
      );
    }
  };

  const isAddDisabled = !isValidEmail(addEmail);
  const isDeleteDisabled = !isValidEmail(deleteEmail);

  return (
    <>
      {userType === "Super Admin" && (
        <div className="w-full p-4 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 shadow-md rounded">
          {/* DELETE ADMIN */}
          <div className="flex items-center mb-2 md:mb-0">
            <button
              disabled={isDeleteDisabled}
              onClick={handleDeleteAdmin}
              className={`${
                isDeleteDisabled
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white font-bold py-1 px-3 rounded mr-2`}
            >
              Delete
            </button>

            <input
              type="email"
              placeholder="Admin Email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
            />

            {isLoadingDel && <Spinner />}
          </div>

          {/* CENTER TEXT */}
          <div className="text-lg font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
            {text}
          </div>

          {/* ADD ADMIN */}
          <div className="flex items-center">
            {isLoadingAdd && <Spinner />}

            <input
              type="email"
              placeholder="Admin Email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2 mx-2 focus:outline-none focus:border-blue-500"
            />

            <button
              disabled={isAddDisabled}
              onClick={handleAddAdmin}
              className={`${
                isAddDisabled
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } text-white font-bold py-1 px-3 rounded`}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {userType === "Admin" && (
        <div className="w-full p-4 flex justify-center bg-white dark:bg-gray-800 shadow-md rounded">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {text}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminHeader;
