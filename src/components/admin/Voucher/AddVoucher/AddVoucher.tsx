/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify"; // ✅ Thêm toast
import {
  cancelEditingVoucher,
  createVoucher,
  updateVoucher,
} from "../../../../redux/slice/voucherSlice";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  isAdd: boolean;
  reload: () => void;
}

export default function AddVoucher(props: Props) {
  const { isAdd, isModalOpen, onClose, reload } = props;
  const [name, setName] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [type, setType] = useState<number | "">("");
  const dispatch = useAppDispatch();
  const editingVoucher = useSelector(
    (state: RootState) => state.voucher.editingVoucher
  );

  const resetData = () => {
    setName("");
    setType(0); // Default: Percentage
    setValue("");
  };

  useEffect(() => {
    if (editingVoucher) {
      setName(editingVoucher.name);
      setValue(editingVoucher.value);
      setType(editingVoucher.isPercentage ? 1 : 0);
    } else {
      resetData();
    }
  }, [editingVoucher]);

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      toast.error("Name is required");
      isValid = false;
    }

    if (value === "" || value <= 0) {
      toast.error("Value must be greater than 0");
      isValid = false;
    }

    if (type !== 0 && type !== 1) {
      toast.error("Please select a valid type");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (isAdd) {
        await dispatch(
          createVoucher({
            name,
            isPercentage: type,
            value,
          })
        ).unwrap();
        toast.success("Create voucher successfully");
        resetData();
      } else if (editingVoucher) {
        await dispatch(
          updateVoucher({
            id: editingVoucher.id,
            name,
            isPercentage: type,
            value,
          })
        ).unwrap();
        toast.success("Update voucher successfully");
      }
      reload();
      onClose();
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
            <h3 className="font-bold text-xl mb-4">
              {isAdd ? "Add" : "Edit"} Voucher
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter voucher name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Value */}
              <div>
                <label className="label">
                  <span className="label-text">Value</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Enter value"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                />
              </div>

              {/* Type */}
              <div>
                <label className="label">
                  <span className="label-text">Type</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={type}
                  onChange={(e) => setType(Number(e.target.value))}
                >
                  <option value={1}>Percentage</option>
                  <option value={0}>Price</option>
                </select>
              </div>

              {/* Actions */}
              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    onClose();
                    resetData();
                    dispatch(cancelEditingVoucher());
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
