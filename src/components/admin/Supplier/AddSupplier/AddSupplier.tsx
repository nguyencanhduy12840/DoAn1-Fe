/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  cancelEditingSupplier,
  createSupplier,
  updateSupplier,
} from "../../../../redux/slice/supplierSlice";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  isAdd: boolean;
  reload: () => void;
}

export default function AddSupplier(props: Props) {
  const { isModalOpen, onClose, reload } = props;
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const editingSupplier = useSelector(
    (state: RootState) => state.supplier.editingSupplier
  );

  const handleReset = () => {
    setName("");
    setAddress("");
    setPhone("");
    setEmail("");
  };
  useEffect(() => {
    if (editingSupplier) {
      setName(editingSupplier.name);
      setAddress(editingSupplier.address);
      setPhone(editingSupplier.phone);
      setEmail(editingSupplier.email);
    } else {
      handleReset();
    }
  }, [editingSupplier]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("Supplier name must not be empty");
      return;
    }

    if (!trimmedAddress) {
      toast.error("Supplier address must not be empty");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Phone number must be 10-15 digits");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      if (editingSupplier === null) {
        await dispatch(
          createSupplier({ name, address, email, phone })
        ).unwrap();
        toast.success("Create supplier successfully");
        setName("");
      } else {
        await dispatch(
          updateSupplier({
            id: editingSupplier.id,
            address,
            email,
            name,
            phone,
          })
        ).unwrap();
        toast.success("Update supplier successfully");
      }
      reload();
      onClose();
      handleReset();
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Đã xảy ra lỗi khi xử lý danh mục";
      toast.error(message);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-xl mb-4">Add Supplier</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
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
                  required
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    onClose();
                    handleReset();
                    dispatch(cancelEditingSupplier());
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
