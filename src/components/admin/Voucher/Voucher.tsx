import { useEffect, useState } from "react";
import AddVoucher from "./AddVoucher/AddVoucher.tsx";
import { RootState, useAppDispatch } from "../../../redux/store.ts";
import { useSelector } from "react-redux";
import { Voucher as VoucherType } from "../../../types/Voucher.ts";
import {
  cancelEditingVoucher,
  deleteVoucher,
  getAllVouchers,
  startEditingVoucher,
} from "../../../redux/slice/voucherSlice.ts";

export default function Voucher() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const size = 5;
  const listVouchers = useSelector(
    (state: RootState) => state.voucher.listVouchers
  );

  const pages = useSelector((state: RootState) => state.voucher.pages);

  const handleEdit = (item: VoucherType) => {
    setIsModalOpen(true);
    setIsAdd(false);
    dispatch(startEditingVoucher(item.id));
  };

  const handleAdd = () => {
    setIsModalOpen(true);
    setIsAdd(true);
    dispatch(cancelEditingVoucher());
  };
  useEffect(() => {
    const fetchCategoriesDetail = async () => {
      try {
        await dispatch(
          getAllVouchers({
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
      await dispatch(deleteVoucher(id)).unwrap();
      dispatch(
        getAllVouchers({
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
          <button className="btn bg-[#293241] text-white" onClick={handleAdd}>
            Add
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table bg-[#e0fbfc] text-center">
            <thead>
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Value</th>
                <th>Type Percentage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listVouchers.map((item, index) => (
                <tr key={item.id}>
                  <td>{(page - 1) * size + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                  <td>{item.isPercentage ? "Percentage" : "Price"}</td>
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
      <AddVoucher
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdd={isAdd}
        reload={() =>
          dispatch(
            getAllVouchers({
              page: (page - 1).toString(),
              size: size.toString(),
            })
          )
        }
      />
    </>
  );
}
