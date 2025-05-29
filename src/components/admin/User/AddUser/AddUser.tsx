import  { useState } from "react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    birthDay: string;
  }) => void;
}

export default function AddUserModal({
                                       isOpen,
                                       onClose,
                                       onAddUser,
                                     }: AddUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [birthDay, setBirthDay] = useState("");

  const handleSubmit = () => {
    onAddUser({ fullName, email, phone, gender, birthDay });

    // Reset form
    setFullName("");
    setEmail("");
    setPhone("");
    setGender("Male");
    setBirthDay("");

    onClose();
  };

  return (
      <>
        {isOpen && (
            <>
              <input
                  type="checkbox"
                  id="add-user-modal"
                  className="modal-toggle"
                  checked={isOpen}
                  onChange={() => {}}
              />
              <div className="modal">
                <div className="modal-box w-[400px]">
                  <h3 className="font-bold text-xl mb-4">Add New User</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>
                      <input
                          type="text"
                          className="input input-bordered w-full"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                          type="email"
                          className="input input-bordered w-full"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                          type="text"
                          className="input input-bordered w-full"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Gender</span>
                      </label>
                      <select
                          className="select select-bordered w-full"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Birth Day</span>
                      </label>
                      <input
                          type="date"
                          className="input input-bordered w-full"
                          value={birthDay}
                          onChange={(e) => setBirthDay(e.target.value)}
                      />
                    </div>

                    <div className="modal-action">
                      <button className="btn btn-primary" onClick={handleSubmit}>
                        Add User
                      </button>
                      <button className="btn" onClick={onClose}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
        )}
      </>
  );
}
