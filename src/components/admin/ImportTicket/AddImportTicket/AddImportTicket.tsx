import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import css của react-datepicker
import AddProductModal from "./AddProductModal";
import { Supplier } from "../../../../types/Supplier";
import { getAllSupplierExist } from "../../../../services/api";
import { useAppDispatch } from "../../../../redux/store";
import { createImportTicket } from "../../../../redux/slice/importTicketSlice";
import { toast } from "react-toastify";
// import { format } from "date-fns"; // Thư viện date-fns để format ngày

interface ProductItem {
  id: number;
  name: string;
  importPrice: number;
  quantity: number;
}

interface AddImportTicketProps {
  isOpen: boolean;
  onClose: () => void;
  reload: () => void;
}

export default function AddImportTicket({
  isOpen,
  onClose,
  reload,
}: AddImportTicketProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Đảm bảo selectedDate là kiểu Date
  const dispatch = useAppDispatch();
  // Mảng nhà cung cấp (danh sách tĩnh ở đây, có thể thay bằng API nếu cần)
  const [suppliers, setSuppliers] = useState<Supplier[]>();

  const totalPrice = products.reduce(
    (sum, item) => sum + item.importPrice * item.quantity,
    0
  );

  const addProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [...prev, { ...newProduct, id: prev.length + 1 }]);
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetForm = () => {
    setProducts([]);
    setSelectedSupplier("");
    setSelectedDate(new Date());
  };

  const handleCreateImportTicket = async () => {
    try {
      const isoDate = new Date(selectedDate).toISOString();
      await dispatch(
        createImportTicket({
          date: isoDate,
          supplierName: selectedSupplier,
          totalPrice: totalPrice,
          listProducts: products.map((item) => ({
            productName: item.name,
            importPrice: item.importPrice,
            quantity: item.quantity,
          })),
        })
      ).unwrap();
      toast.success("Import ticket created successfully!");
      reload();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating import ticket:", error);
    }
  };
  useEffect(() => {
    const fetchAllSuppliersExists = async () => {
      try {
        const res = await getAllSupplierExist({ page: "0", size: "100" });
        console.log(res);
        setSuppliers(res.data.result);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchAllSuppliersExists();
  }, []);
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="mb-4">
          <h3 className="font-bold text-lg">Add Import Ticket</h3>
        </div>
        {/* Date input */}
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <DatePicker
            selected={selectedDate} // selectedDate phải là kiểu Date
            onChange={(date: Date | null) => {
              if (date) {
                setSelectedDate(date); // Cập nhật selectedDate với kiểu Date
              }
            }}
            dateFormat="dd/MM/yyyy" // Định dạng dd/mm/yyyy
            className="input input-bordered w-full"
          />
        </div>

        {/* Supplier dropdown */}
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Supplier</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="" disabled>
              Select a supplier
            </option>
            {suppliers &&
              suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
          </select>
        </div>

        {/* Total Price display */}
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Total Price</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={`$${totalPrice.toFixed(2)}`}
            readOnly
          />
        </div>
        <div className="flex justify-end mb-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddProductModalOpen(true)}
          >
            Add Product
          </button>
        </div>
        {/* Products Table */}
        <div className="overflow-x-auto mb-4">
          <table className="table bg-base-200 text-center">
            <thead>
              <tr>
                <th>STT</th>
                <th>Product Name</th>
                <th>Import Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={item.id}>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td>${item.importPrice}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => removeProduct(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-gray-500 text-center">
                    No products added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button
            className="btn btn-success"
            onClick={handleCreateImportTicket}
          >
            Save
          </button>
          <button
            className="btn"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Modal Add Product */}
      {isAddProductModalOpen && (
        <AddProductModal
          onClose={() => setIsAddProductModalOpen(false)}
          onAdd={addProduct}
        />
      )}
    </div>
  );
}
