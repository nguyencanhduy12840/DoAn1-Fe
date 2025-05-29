import { useEffect, useState, useMemo } from "react";
import {
  getAllProductsExist,
  getAllVouchersExist,
} from "../../../../services/api";
import { Product } from "../../../../types/Product";
import { useAppDispatch } from "../../../../redux/store";
import { createSaleTicketAdmin } from "../../../../redux/slice/saleTicketSlice";
import { Voucher } from "../../../../types/Voucher";
import { toast } from "react-toastify";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number; // unit price
}

export default function AddOrderTicket({
  isOpen,
  onClose,
  reload,
}: {
  isOpen: boolean;
  onClose: () => void;
  reload: () => void; // optional reload function
}) {
  /* ──────────────────────── state ──────────────────────── */
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderProducts, setOrderProducts] = useState<OrderItem[]>([]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherId, setVoucherId] = useState<number | null>(null);

  // state for “add product” modal
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);

  const [productsList, setProductList] = useState<Product[]>([]);

  const dispatch = useAppDispatch();

  /* ─────────────────────── data ─────────────────────── */
  useEffect(() => {
    const fetchAllProductActive = async () => {
      const res = await getAllProductsExist({ page: "0", size: "100" });
      setProductList(res.data.result);
    };

    fetchAllProductActive();
  }, []);

  useEffect(() => {
    const fetchAllVoucherActive = async () => {
      const res = await getAllVouchersExist({ page: "0", size: "100" });
      setVouchers(res.data.result);
    };
    fetchAllVoucherActive();
  }, []);

  const handleAddOrder = async () => {
    try {
      const isoDate = new Date().toISOString();
      await dispatch(
        createSaleTicketAdmin({
          fullName: customerName,
          address: address,
          date: isoDate,
          phoneNumber,
          totalPrice: calculateTotalPrice(),
          voucherId: voucherId ? voucherId : 0,
          listProducts: orderProducts.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
          })),
        })
      ).unwrap();
      toast.success("Order created successfully!");
      reload();
      resetForm();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const selectedProductData = useMemo(
    () => productsList.find((p) => +p.id === selectedProduct),
    [selectedProduct, productsList]
  );

  const resetForm = () => {
    setCustomerName("");
    setOrderProducts([]);
    setSelectedProduct(null);
    setProductQuantity(1);
    setAddress("");
    setPhoneNumber("");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const addProductToOrder = () => {
    if (!selectedProductData) return;

    const newOrderProduct: OrderItem = {
      id: Date.now(), // unique id
      productName: selectedProductData.name,
      quantity: productQuantity,
      price: selectedProductData.price,
    };
    setOrderProducts((prev) => [...prev, newOrderProduct]);

    // reset modal‑local state
    setIsAddProductModalOpen(false);
    setProductQuantity(1);
    setSelectedProduct(null);
  };

  const handleRemoveProduct = (id: number) => {
    setOrderProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const calculateTotalPrice = () =>
    orderProducts.reduce((t, i) => t + i.quantity * i.price, 0);

  /* ──────────────────────── UI ──────────────────────── */
  return (
    <>
      {/* Main Add‑Order modal */}
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            {/* header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Order Ticket</h3>
              <button className="btn btn-sm btn-outline" onClick={handleCancel}>
                Close
              </button>
            </div>

            {/* customer name */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Customer Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Phone number</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* total */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Total Price</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={`$${calculateTotalPrice().toFixed(2)}`}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Voucher</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={voucherId ?? ""}
                onChange={(e) => setVoucherId(Number(e.target.value) || null)}
              >
                <option value="">Select a voucher</option>
                {vouchers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* product table */}
            <div className="overflow-x-auto mb-4">
              <table className="table bg-base-200 text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orderProducts.map((item, idx) => (
                    <tr key={item.id}>
                      <th>{idx + 1}</th>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleRemoveProduct(item.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orderProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-gray-500">
                        No products added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setIsAddProductModalOpen(true)}
              >
                Add Product
              </button>
            </div>

            {/* actions */}
            <div className="modal-action">
              <button className="btn btn-success" onClick={handleAddOrder}>
                Save Order
              </button>
              <button className="btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add‑product modal */}
      {isAddProductModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">Add Product</h3>

            {/* product select */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Product</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedProduct ?? ""}
                onChange={(e) =>
                  setSelectedProduct(Number(e.target.value) || null)
                }
              >
                <option value="" disabled>
                  Select a product
                </option>
                {productsList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* quantity */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={productQuantity}
                onChange={(e) =>
                  setProductQuantity(Math.max(1, +e.target.value))
                }
                min={1}
              />
            </div>

            {/* computed price */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                readOnly
                value={
                  selectedProductData
                    ? `$${(selectedProductData.price * productQuantity).toFixed(
                        2
                      )}`
                    : ""
                }
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-success" onClick={addProductToOrder}>
                Add
              </button>
              <button
                className="btn"
                onClick={() => setIsAddProductModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
