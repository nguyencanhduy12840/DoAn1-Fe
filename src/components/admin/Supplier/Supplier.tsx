import { useEffect, useState } from "react";
import AddSupplier from "./AddSupplier/AddSupplier.tsx";
import { RootState, useAppDispatch } from "../../../redux/store.ts";
import { useSelector } from "react-redux";
import {
  cancelEditingSupplier,
  deleteSupplier,
  getAllSuppliers,
  startEditingSupplier,
} from "../../../redux/slice/supplierSlice.ts";
import { Supplier as SupplierType } from "../../../types/Supplier.ts";

export default function Supplier() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const size = 5;
  const listSuppliers = useSelector(
    (state: RootState) => state.supplier.listSuppliers
  );

  const pages = useSelector((state: RootState) => state.supplier.pages);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        await dispatch(
          getAllSuppliers({
            page: (page - 1).toString(),
            size: size.toString(),
          })
        ).unwrap();
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchSuppliers();
  }, [dispatch, page]);

  const handleEdit = (item: SupplierType) => {
    setIsModalOpen(true);
    setIsAdd(false);
    dispatch(startEditingSupplier(item.id));
  };

  const handleAdd = () => {
    setIsModalOpen(true);
    setIsAdd(true);
    dispatch(cancelEditingSupplier());
  };

  const handleToggleDelete = async (id: string) => {
    try {
      await dispatch(deleteSupplier(id)).unwrap();
      dispatch(
        getAllSuppliers({
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
        <div className="mb-[30px] flex justify-end">
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
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listSuppliers.map((item, index) => (
                <tr key={item.id}>
                  <td>{(page - 1) * size + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
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
              {/* Add more rows as needed */}
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
      <AddSupplier
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdd={isAdd}
        reload={() =>
          dispatch(
            getAllSuppliers({
              page: (page - 1).toString(),
              size: size.toString(),
            })
          )
        }
      />
    </>
  );
}
