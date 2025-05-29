import { useState, useEffect } from "react";

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: number, newPassword: string) => void;
  userId: number | null;
}

export default function EditPasswordModal({
  isOpen,
  onClose,
  onSubmit,
  userId,
}: EditPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!newPassword.trim()) {
      alert("Password cannot be empty.");
      return;
    }
    if (userId !== null) {
      onSubmit(userId, newPassword);
      setNewPassword("");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Update User Password</h3>

            <div className="py-4">
              <input
                type="password"
                placeholder="Enter new password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
