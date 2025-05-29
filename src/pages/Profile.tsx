import React, { useState, useEffect } from "react";
import { User } from "../types/User";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { updateUserInformation } from "../redux/slice/userSlice";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

const Profile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(
    user.birthday ? new Date(user.birthday) : null
  );
  const [profile, setProfile] = useState<User>(user); // khởi tạo từ redux
  const dispatch = useAppDispatch();
  console.log(user);
  useEffect(() => {
    setProfile(user);
    setBirthday(user.birthday ? new Date(user.birthday) : null);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updateUserInformation({
          ...profile,
          birthday: birthday ? birthday.toISOString() : undefined,
        })
      ).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordError("");
    console.log("Password updated successfully");
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-[30px] mb-[40px]">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        <div className="form-control mb-4">
          <label className="label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="input input-bordered"
            value={profile.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">Address</label>
          <input
            type="text"
            name="address"
            className="input input-bordered"
            value={profile.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            className="input input-bordered"
            value={profile.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">Gender</label>
          <div className="flex gap-4">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="label cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={profile.gender === g}
                  onChange={handleChange}
                  className="radio"
                />
                <span className="ml-2 capitalize">{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-control mb-6">
          <label className="label">Birthday</label>
          <DatePicker
            selected={birthday}
            onChange={(date: Date | null) => setBirthday(date)}
            dateFormat="dd/MM/yyyy"
            className="input input-bordered w-full"
            placeholderText="Select your birthday"
            isClearable
          />
        </div>

        <div className="flex justify-end gap-3">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsModalOpen(true)}
          >
            Change Password
          </button>
          <button className="btn">Cancel</button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Change Password</h3>

              <div className="form-control mb-3">
                <label className="label">Current Password</label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-control mb-3">
                <label className="label">New Password</label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {passwordError && (
                <div className="text-red-500 text-sm mb-2">{passwordError}</div>
              )}

              <div className="modal-action">
                <button
                  className="btn btn-primary"
                  onClick={handlePasswordUpdate}
                >
                  Update
                </button>
                <button className="btn" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
