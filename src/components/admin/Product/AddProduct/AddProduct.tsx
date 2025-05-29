/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../../../../redux/store";
import {
  cancelEditingProduct,
  createProduct,
  updateProduct,
} from "../../../../redux/slice/productSlice";
import { ProductDTO } from "../../../../types/dto/ProductDTO";
import { toast } from "react-toastify";
import { getAllCategoriesDetailExist } from "../../../../services/api";
import { useSelector } from "react-redux";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  isAdd: boolean;
  reload: () => void;
}

interface CategoryDetail {
  id: number;
  name: string;
}

export default function AddProduct(props: Props) {
  const { isModalOpen, onClose, isAdd, reload } = props;
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryDetailOptions, setCategoryDetailOptions] = useState<
    CategoryDetail[]
  >([]);
  const [selectedCategoryDetailIds, setSelectedCategoryDetailIds] = useState<
    number[]
  >([]);

  const dispatch = useAppDispatch();
  const editingProduct = useSelector(
    (state: RootState) => state.product.editingProduct
  );
  useEffect(() => {
    if (isModalOpen) {
      const fetchCategoriesDetails = async () => {
        const response = await getAllCategoriesDetailExist({
          page: "0",
          size: "100",
        });
        setCategoryDetailOptions(
          response.data.result.map((cat: any) => ({
            ...cat,
            id: Number(cat.id),
          }))
        );
      };
      fetchCategoriesDetails();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price);
      setQuantity(editingProduct.quantity);
      setDescription(editingProduct.description);
      setSelectedCategoryDetailIds(
        editingProduct.categoryDetails.map((cat: any) => cat.id)
      );
      if (editingProduct.productImage) {
        setImagePreview(`http://localhost:8080${editingProduct.productImage}`);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    } else {
      setName("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setSelectedCategoryDetailIds([]);
    }
  }, [editingProduct]);

  const handleCheckboxChange = (id: number) => {
    setSelectedCategoryDetailIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Omit<ProductDTO, "id"> = {
      name,
      price: Number(price),
      quantity: Number(quantity),
      description,
      productImage: imageFile,
      categoryDetailId: selectedCategoryDetailIds,
    };

    const productDataUpdate: ProductDTO = {
      id: Number(editingProduct?.id),
      name,
      price: Number(price),
      quantity: Number(quantity),
      description,
      productImage: imageFile ?? null,
      categoryDetailId: selectedCategoryDetailIds,
    };

    try {
      if (editingProduct === null) {
        dispatch(createProduct(productData))
          .unwrap()
          .then(() => {
            toast.success("Create product successfully");
            setName("");
            setPrice("");
            setQuantity("");
            setDescription("");
            setImageFile(null);
            setImagePreview(null);
            setSelectedCategoryDetailIds([]);
            onClose();
          });
      } else {
        dispatch(updateProduct(productDataUpdate))
          .unwrap()
          .then(() => {
            toast.success("Update category detail successfully");
          });
      }
      reload();
      onClose();
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Đã xảy ra lỗi khi xử lý danh mục";
      toast.error(message);
    }
  };

  return (
    <>
      {isModalOpen && (
        <>
          <input
            type="checkbox"
            id="add-product-modal"
            className="modal-toggle"
            checked={isModalOpen}
            onChange={() => {}}
          />
          <div className="modal">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-xl mb-4">
                {isAdd ? "Add" : "Edit"} Product
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-row gap-6">
                  {/* Left Column */}
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Name */}
                    <div>
                      <label className="label">
                        <span className="label-text">Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="label">
                        <span className="label-text">Price</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="label">
                        <span className="label-text">Quantity</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="label">
                        <span className="label-text">Description</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    {/* Product Image */}
                    <div>
                      <label className="label">
                        <span className="label-text">Product Image</span>
                      </label>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-40 h-40 bg-gray-100 border border-dashed rounded flex items-center justify-center overflow-hidden">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="file-input file-input-bordered w-full max-w-xs"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Category Checkboxes */}
                  <div className="w-64 border-l pl-4">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Categories
                      </span>
                    </label>
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                      {categoryDetailOptions.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedCategoryDetailIds.includes(cat.id)}
                            onChange={() => handleCheckboxChange(cat.id)}
                          />
                          <span>{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="modal-action mt-6">
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      onClose();
                      setImagePreview(null);
                      setImageFile(null);
                      dispatch(cancelEditingProduct());
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
