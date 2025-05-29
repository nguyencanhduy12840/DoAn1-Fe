import { useEffect, useState } from "react";
import AddProduct from "./AddProduct/AddProduct";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../redux/store";
import {
  deleteProduct,
  getAllProducts,
  startEditingProduct,
} from "../../../redux/slice/productSlice";
import { Product as ProductType } from "../../../types/Product";

export default function Product() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const size = 5;

  const listProducts = useSelector(
    (state: RootState) => state.product.listProducts
  );

  const handleEdit = (item: ProductType) => {
    setIsModalOpen(true);
    setIsAdd(false);
    dispatch(startEditingProduct(item.id));
  };

  useEffect(() => {
    const fetchCategoriesDetail = async () => {
      try {
        await dispatch(
          getAllProducts({
            page: (page - 1).toString(),
            size: size.toString(),
          })
        ).unwrap();
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategoriesDetail();
  }, [dispatch, page]);

  const handleToggleDelete = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      dispatch(
        getAllProducts({
          page: (page - 1).toString(),
          size: size.toString(),
        })
      );
    } catch (error) {
      console.error("Lỗi khi toggle status:", error);
    }
  };

  const pages = useSelector((state: RootState) => state.product.pages);
  return (
    <>
      <div className="mx-auto w-[95%]">
        <div className="mb-[30px] flex justify-end">
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
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {listProducts.map((item, index) => (
                <tr key={item.id}>
                  <th>{(page - 1) * size + index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.price}$</td>
                  <td>{item.quantity}</td>
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
      <AddProduct
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdd={isAdd}
        reload={() =>
          dispatch(
            getAllProducts({
              page: (page - 1).toString(),
              size: size.toString(),
            })
          )
        }
      />
    </>
  );
}
