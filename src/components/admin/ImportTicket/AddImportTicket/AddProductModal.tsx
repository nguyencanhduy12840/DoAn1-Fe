import { useEffect, useState } from "react";
import { Product } from "../../../../types/Product";
import { getAllProductsExist } from "../../../../services/api";

interface ProductItem {
  id: number;
  name: string;
  importPrice: number;
  quantity: number;
}

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: ProductItem) => void;
}

export default function AddProductModal({
  onClose,
  onAdd,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [productsList, setProductList] = useState<Product[]>([]);
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name) {
      newErrors.name = "Product name is required.";
    }
    if (
      !importPrice ||
      isNaN(Number(importPrice)) ||
      Number(importPrice) <= 0
    ) {
      newErrors.importPrice = "Import price must be a number greater than 0.";
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = "Quantity must be a number greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAdd({
      id: 0,
      name,
      importPrice: Number(importPrice),
      quantity: Number(quantity),
    });

    onClose();
    setName("");
    setImportPrice("");
    setQuantity("");
    setErrors({});
  };

  useEffect(() => {
    const fetchAllProductActive = async () => {
      const res = await getAllProductsExist({ page: "0", size: "100" });
      const productList = res.data.result;
      setProductList(productList);

      if (productList.length > 0 && name === "") {
        setName(productList[0].name);
      }
    };

    fetchAllProductActive();
  }, []);

  return (
    <>
      <input
        type="checkbox"
        id="add-product-modal"
        className="modal-toggle"
        checked
        readOnly
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add Product</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Dropdown Product Name */}
            <div>
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              >
                <option value="" disabled>
                  -- Select a product --
                </option>
                {productsList.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Import Price - Text input for numbers */}
            <div>
              <label className="label">
                <span className="label-text">Import Price</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                className="input input-bordered w-full"
                value={importPrice}
                onChange={(e) => setImportPrice(e.target.value)}
              />
              {errors.importPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.importPrice}
                </p>
              )}
            </div>

            {/* Quantity - Text input for numbers */}
            <div>
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="input input-bordered w-full"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Add
              </button>
              <button type="button" className="btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
