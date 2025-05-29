/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { toast } from "react-toastify";
import {
  cancelEditingCategoryDetail,
  createCategoryDetail,
  updateCategoryDetail,
} from "../../../../redux/slice/categoryDetailSlice";
import { useSelector } from "react-redux";

import { Category } from "../../../../types/Category";
import { getAllCategoriesExist } from "../../../../services/api";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  isAdd: boolean;
  reload: () => void;
}
export default function AddCategoryDetail(props: Props) {
  const { isModalOpen, onClose, isAdd, reload } = props;
  const [name, setName] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const dispatch = useAppDispatch();
  const editingCategory = useSelector(
    (state: RootState) => state.categoryDetail.editingCategoryDetail
  );
  const [listCategories, setListCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategoriesExist({ page: "0", size: "100" });
      setListCategories(response.data.result);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingCategory && listCategories.length > 0) {
      setName(editingCategory.name);
      setMainCategory(editingCategory.categoryEntity.id);
    } else if (!editingCategory) {
      setName("");
      setMainCategory("");
    }
  }, [editingCategory, listCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category detail name must not be empty");
      return;
    }
    if (!mainCategory) {
      toast.error("Main category must not be empty");
      return;
    }
    try {
      if (isAdd) {
        await dispatch(
          createCategoryDetail({ name, categoryId: mainCategory })
        ).unwrap();
        toast.success("Create category detail successfully");
        setName("");
        setMainCategory("");
      } else if (editingCategory) {
        await dispatch(
          updateCategoryDetail({
            id: editingCategory.id,
            name,
            categoryId: mainCategory,
          })
        ).unwrap();
        toast.success("Update category detail successfully");
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
        <div className="p-4">
          <input
            type="checkbox"
            id="add-category-modal"
            className="modal-toggle"
            checked={isModalOpen}
            onChange={() => {}}
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                {isAdd ? "Add" : "Edit"} Category Detail
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name input */}
                <div>
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Main Category select */}
                <div>
                  <label className="label">
                    <span className="label-text">Main Category</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={mainCategory}
                    onChange={(e) => setMainCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select main category
                    </option>
                    {listCategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit button */}
                <div className="modal-action">
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      onClose();
                      setName("");
                      setMainCategory("");
                      dispatch(cancelEditingCategoryDetail());
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
