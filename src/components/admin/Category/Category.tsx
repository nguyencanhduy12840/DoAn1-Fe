import { useEffect, useState } from "react";
import AddCategory from "./AddCategory/AddCategory";
import { Category as CategoryType } from "../../../types/Category";
import { useAppDispatch, RootState } from "../../../redux/store";
import {
  deleteCategory,
  getAllCategories,
  startEditingCategory,
} from "../../../redux/slice/categorySlice";
import { useSelector } from "react-redux";

export default function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const size = 5;
  const categories = useSelector(
    (state: RootState) => state.category.listCategories
  );

  const pages = useSelector((state: RootState) => state.category.pages);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await dispatch(
          getAllCategories({
            page: (page - 1).toString(),
            size: size.toString(),
          })
        ).unwrap();
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    fetchCategories();
  }, [dispatch, page]);

  const handleEdit = (category: CategoryType) => {
    setIsModalOpen(true);
    setIsAdd(false);
    dispatch(startEditingCategory(category.id));
  };

  const handleToggleDelete = async (id: string) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      dispatch(
        getAllCategories({
          page: (page - 1).toString(),
          size: size.toString(),
        })
      );
    } catch (error) {
      console.error("Lỗi khi toggle status:", error);
    }
  };

  return (
    <>
      <div className="mx-auto w-[95%]">
        <div className="mb-6 flex justify-end">
          <button
            className="btn bg-[#293241] text-white"
            onClick={() => {
              setIsModalOpen(true);
              setIsAdd(true);
            }}
          >
            Add
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table bg-[#e0fbfc] text-center">
            {/* head */}
            <thead>
              <tr>
                <th>STT</th>
                <th className="w-[80%]">Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={category.id}>
                    <th>{(page - 1) * size + index + 1}</th>
                    <td>{category?.name}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-outline btn-info"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-sm ${
                            category.status
                              ? "btn-outline btn-error"
                              : "btn-outline btn-success"
                          }`}
                          onClick={() => handleToggleDelete(category.id)}
                        >
                          {category.status ? "Delete" : "Restore"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Không có danh mục nào.</td>
                </tr>
              )}
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
                className={`btn btn-sm ${page === idx + 1 ? "btn-active" : ""}`}
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

      <AddCategory
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdd={isAdd}
        reload={() =>
          dispatch(
            getAllCategories({
              page: (page - 1).toString(),
              size: size.toString(),
            })
          )
        }
      />
    </>
  );
}
