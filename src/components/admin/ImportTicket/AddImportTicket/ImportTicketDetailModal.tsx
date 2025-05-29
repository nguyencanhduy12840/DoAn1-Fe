import { ImportTicket as ImportTicketType } from "../../../../types/ImportTicket";
import { formatDateTime } from "../../../../utils/dataUtils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: ImportTicketType | null;
}

export default function ImportTicketDetailModal({
  isOpen,
  onClose,
  ticket,
}: Props) {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white w-[90%] max-w-3xl rounded-lg p-6 shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Import Ticket Detail</h2>

        <div className="mb-4 space-y-2">
          <p>
            <strong>Supplier Name:</strong> {ticket.supplierEntity.name}
          </p>
          <p>
            <strong>Date:</strong> {formatDateTime(ticket.date)}
          </p>
          <p>
            <strong>Total:</strong> ${ticket.total.toFixed(2)}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="table bg-gray-100 text-center">
            <thead>
              <tr>
                <th>STT</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {ticket.importTicketDetails?.length > 0 ? (
                ticket.importTicketDetails.map((product, index) => (
                  <tr key={product.productEntity.id}>
                    <td>{index + 1}</td>
                    <td>{product.productEntity.name}</td>
                    <td>{product.quantity}</td>
                    <td>${product.importPrice.toFixed(2)}</td>
                    <td>
                      ${(product.importPrice * product.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-gray-500 py-4">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          <button
            className="btn btn-sm bg-[#293241] text-white hover:bg-[#1e2a36]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
