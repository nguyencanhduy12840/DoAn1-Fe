import { useEffect, useState } from "react";

import { RootState, useAppDispatch } from "../../../redux/store";
import { useSelector } from "react-redux";
import {
  changeUserPassword,
  getAllUsers,
} from "../../../redux/slice/userSlice";
import EditPasswordModal from "./AddUser/EditPasswordModal";
import { toast } from "react-toastify";

export default function User() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const size = 5;
  const users = useSelector((state: RootState) => state.user.listUsers);

  const pages = useSelector((state: RootState) => state.user.pages);
  const handleEditPassword = (userId: number) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleUpdatePassword = async (userId: number, newPassword: string) => {
    try {
      await dispatch(changeUserPassword({ id: userId, newPassword })).unwrap();
      setIsEditModalOpen(false);
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(
          getAllUsers({
            page: (page - 1).toString(),
            size: size.toString(),
          })
        ).unwrap();
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    fetchUsers();
  }, [dispatch, page]);

  return (
    <>
      <div className="relative">
        <div className="mx-auto w-[95%]">
          <div className="mb-[30px] flex justify-end"></div>
          <div className="overflow-x-auto">
            <table className="table bg-[#e0fbfc] text-center">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Full Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Gender</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <th>{index + 1}</th>
                    <td>{user.fullName}</td>
                    <td>{user.address}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.gender}</td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button
                          className="btn btn-sm btn-outline btn-info"
                          onClick={() => handleEditPassword(+user.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-2">
              <button
                className="btn btn-sm"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Prev
              </button>
              {[...Array(pages)].map((_, idx) => (
                <button
                  key={idx}
                  className={`btn btn-sm ${
                    page === idx + 1 ? "btn-active" : ""
                  }`}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="btn btn-sm"
                disabled={page === pages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditPasswordModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdatePassword}
        userId={selectedUserId}
      />
    </>
  );
}
