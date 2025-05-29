import { useEffect, useState } from "react";
import AddCategoryDetail from "./AddCategoryDetail/AddCategoryDetail";
import { CategoryDetail as CategoryDetailType } from "../../../types/CategoryDetail";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../redux/store";
import {
  cancelEditingCategoryDetail,
  deleteCategoryDetail,
  getAllCategoriesDetail,
  startEditingCategoryDetail,
} from "../../../redux/slice/categoryDetailSlice";
import { getAllCategories } from "../../../redux/slice/categorySlice";

export default function CategoryDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const size = 5;
  const listCategoriesDetail = useSelector(
    (state: RootState) => state.categoryDetail.listCategoriesDetail
  );

  const pages = useSelector((state: RootState) => state.categoryDetail.pages);

  const handleEdit = (item: CategoryDetailType) => {
    setIsModalOpen(true);
    setIsAdd(false);
    dispatch(startEditingCategoryDetail(item.id));
  };

  const handleAdd = () => {
    setIsModalOpen(true);
    setIsAdd(true);
    dispatch(cancelEditingCategoryDetail());
  };
  useEffect(() => {
    const fetchCategoriesDetail = async () => {
      try {
        await dispatch(
          getAllCategoriesDetail({
            page: (page - 1).toString(),
            size: size.toString(),
          })
        ).unwrap();
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategoriesDetail();
    dispatch(getAllCategories({ page: "0", size: "100" }));
  }, [dispatch, page]);

  const handleToggleDelete = async (id: string) => {
    try {
      await dispatch(deleteCategoryDetail(id)).unwrap();
      dispatch(
        getAllCategoriesDetail({
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
            onClick={() => handleAdd()}
          >
            Add
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table bg-[#e0fbfc] text-center">
            <thead>
              <tr>
                <th>STT</th>
                <th className="w-[35%]">Name</th>
                <th className="w-[35%]">Main Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listCategoriesDetail.map((item, index) => (
                <tr key={item.id}>
                  <th>{(page - 1) * size + index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item?.categoryEntity.name}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-sm btn-outline btn-info"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className={`btn btn-sm ${
                          item.status
                            ? "btn-outline btn-error"
                            : "btn-outline btn-success"
                        }`}
                        onClick={() => handleToggleDelete(item.id)}
                      >
                        {item.status ? "Delete" : "Restore"}
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
      <AddCategoryDetail
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdd={isAdd}
        reload={() =>
          dispatch(
            getAllCategoriesDetail({
              page: (page - 1).toString(),
              size: size.toString(),
            })
          )
        }
      />
    </>
  );
}
