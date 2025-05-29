import { Product } from "../../../../types/Product";
import { Voucher } from "../../../../types/Voucher";

interface ViewOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  phoneNumber: string;
  address: string;
  voucher: Voucher;
  totalPrice: number;
  products: Array<{
    id: number;
    quantity: number;
    productEntity: Product;
  }>;
}

export default function ViewOrderDetailModal({
  isOpen,
  onClose,
  customerName,
  phoneNumber,
  address,
  totalPrice,
  voucher,
  products,
}: ViewOrderDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl w-11/12">
        <h3 className="font-bold text-lg mb-4">Order Details</h3>

        <div className="mb-2">
          <strong>Customer Name:</strong> {customerName}
        </div>
        <div className="mb-2">
          <strong>Phone Number:</strong> {phoneNumber}
        </div>
        <div className="mb-2">
          <strong>Address:</strong> {address}
        </div>
        <div className="mb-2">
          <strong>Voucher:</strong> {voucher.name} ( -{voucher.value}{" "}
          {voucher.isPercentage ? "%" : "$"} )
        </div>
        <div className="mb-4">
          <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr>
                <th>STT</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
              {products.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.productEntity.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    ${(item.productEntity.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
