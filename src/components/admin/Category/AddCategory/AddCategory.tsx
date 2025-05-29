/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/store";
import {
  cancelEditingCategory,
  createCategory,
  updateCategory,
} from "../../../../redux/slice/categorySlice";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isAdd: boolean;
  reload: () => void;
}

export default function AddCategory(props: Props) {
  const { isOpen, onClose, isAdd, reload } = props;
  const [name, setName] = useState<string>("");
  const editingCategory = useSelector(
    (state: RootState) => state.category.editingCategory
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName("");
    }
  }, [editingCategory]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Category name must not be empty");
      return;
    }

    try {
      if (isAdd) {
        await dispatch(createCategory({ name })).unwrap();
        toast.success("Create category successfully");
        setName("");
      } else if (editingCategory) {
        await dispatch(
          updateCategory({ id: editingCategory.id, name })
        ).unwrap();
        toast.success("Update category successfully");
      }
      reload();
      onClose();
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "An error occurred while processing the category";
      toast.error(message);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {isAdd ? "Create new category" : "Update category"}
            </h3>
            <div className="py-4">
              <input
                type="text"
                placeholder="Nhập tên danh mục"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  onClose();
                  setName("");
                  dispatch(cancelEditingCategory());
                }}
              >
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {isAdd ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
