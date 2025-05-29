import { useEffect, useState } from "react";
import AddImportTicket from "./AddImportTicket/AddImportTicket";
import { ImportTicket as ImportTicketType } from "../../../types/ImportTicket";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../redux/store";
import {
  confirmCompleteImportTicket,
  deleteImportTicket,
  getAllImportTicket,
} from "../../../redux/slice/importTicketSlice";
import { formatDateTime } from "../../../utils/dataUtils";
import ImportTicketDetailModal from "./AddImportTicket/ImportTicketDetailModal";

export default function ImportTicket() {
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState<ImportTicketType | null>(
    null
  );

  const [page, setPage] = useState(1);
  const size = 2;

  const importTickets = useSelector(
    (state: RootState) => state.importTicket.listImportTicket
  );
  const pages = useSelector((state: RootState) => state.importTicket.pages);

  const dispatch = useAppDispatch();

  const viewDetail = (ticket: ImportTicketType) => {
    setSelectedImport(ticket);
    setIsDetailModalOpen(true);
  };

  const toggleImported = async (id: number) => {
    try {
      await dispatch(confirmCompleteImportTicket(id.toString())).unwrap();
    } catch (error) {
      console.error("Failed to confirm import:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteImportTicket(id.toString())).unwrap();
      // Reload current page after delete
      dispatch(
        getAllImportTicket({
          page: (page - 1).toString(),
          size: size.toString(),
        })
      );
    } catch (error) {
      console.error("Failed to delete import ticket:", error);
    }
  };

  useEffect(() => {
    const fetchAllImportTickets = async () => {
      try {
        await dispatch(
          getAllImportTicket({
            page: (page - 1).toString(),
            size: size.toString(),
          })
        ).unwrap();
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllImportTickets();
  }, [dispatch, page]);

  return (
    <>
      <div className="mx-auto w-[95%]">
        <div className="mb-[30px] flex justify-end">
          <button
            className="btn bg-[#293241] text-white"
            onClick={() => setIsAddTicketModalOpen(true)}
          >
            Add
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table bg-[#e0fbfc] text-center">
            <thead>
              <tr>
                <th>STT</th>
                <th>Date</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {importTickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500">
                    No tickets found.
                  </td>
                </tr>
              )}
              {importTickets.map((ticket, index) => (
                <tr key={ticket.id}>
                  <th>{(page - 1) * size + index + 1}</th>
                  <td>{formatDateTime(ticket.date)}</td>
                  <td>${ticket.total.toFixed(2)}</td>
                  <td>
                    <div className="flex justify-center gap-2 flex-wrap">
                      <button
                        className="btn btn-sm btn-outline btn-info"
                        onClick={() => viewDetail(ticket)}
                      >
                        View Detail
                      </button>

                      <button
                        className={`btn btn-sm ${
                          ticket.status ? "btn-success" : "btn-warning"
                        } w-[120px]`}
                        onClick={() => toggleImported(ticket.id)}
                      >
                        {ticket.status ? "Imported" : "Not Imported"}
                      </button>

                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        Delete
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
              onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddImportTicket
        isOpen={isAddTicketModalOpen}
        onClose={() => setIsAddTicketModalOpen(false)}
        reload={() =>
          dispatch(
            getAllImportTicket({
              page: (page - 1).toString(),
              size: size.toString(),
            })
          )
        }
      />

      <ImportTicketDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        ticket={selectedImport}
      />
    </>
  );
}
