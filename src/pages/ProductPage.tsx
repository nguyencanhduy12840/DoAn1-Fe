import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";

import { addToCart } from "../redux/slice/cartSlice";
import { Product } from "../types/Product";
import { Category } from "../types/Category";
import { getAllCategoriesExist, getAllProductsExist } from "../services/api";
import { toast } from "react-toastify";

const ProductPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [listProduct, setListProduct] = useState<Product[]>();
  const [listCategory, setListCategory] = useState<Category[]>();
  const username = useSelector((state: RootState) => state.user.user.username);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const cartItems = useSelector((state: RootState) => state.cart.listOrderItem);

  const handleSubCategoryChange = (id: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchAllProductExist = async () => {
      const res = await getAllProductsExist({ page: "0", size: "100" });
      setListProduct(res.data.result);
    };
    const fetchAllCategoryExist = async () => {
      const res = await getAllCategoriesExist({ page: "0", size: "100" });
      setListCategory(res.data.result);
    };
    fetchAllProductExist();
    fetchAllCategoryExist();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset page when filter changes
  }, [searchTerm, minPrice, maxPrice, selectedSubCategories]);

  const filteredProducts = (listProduct as Product[])?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      (minPrice === undefined || product.price >= minPrice) &&
      (maxPrice === undefined || product.price <= maxPrice);
    const matchesSubCategory =
      selectedSubCategories.length === 0 ||
      product.categoryDetails.some((cd) =>
        selectedSubCategories.includes(cd.id)
      );

    return matchesSearch && matchesPrice && matchesSubCategory;
  });

  const totalFilteredPages = Math.ceil(
    (filteredProducts as Product[])?.length / itemsPerPage
  );
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const addProduct = async (productId: number) => {
    const product = listProduct?.find((p) => +p.id === productId);
    if (!product) return;

    const currentInCart = cartItems.find(
      (item) => +item.productEntity.id === productId
    );
    const currentQty = currentInCart ? currentInCart.quantity : 0;

    if (currentQty + 1 > product.quantity) {
      toast.error("Cannot add more than available stock!", {
        position: "top-right",
      });
      return;
    }

    try {
      await dispatch(
        addToCart({ username, productId: productId, quantity: 1 })
      ).unwrap();
      toast.success("Added to cart!", { position: "top-right" });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to cart.", { position: "top-right" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex px-4 py-8 gap-8">
        {/* Filter Section */}
        <aside className="w-full md:w-1/4 bg-pink-50 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">Filter</h2>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Category</h3>
            {listCategory?.map((cat, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-pink-700 mb-1">{cat.name}</p>
                <ul className="ml-2">
                  {cat.categoryDetails?.map((sub, j) => {
                    if (sub.status === true) {
                      return (
                        <li key={j} className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm checkbox-primary"
                            value={sub.id}
                            checked={selectedSubCategories.includes(sub.id)}
                            onChange={() => handleSubCategoryChange(sub.id)}
                          />
                          <label className="text-sm">{sub.name}</label>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Price Range</h3>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                className="input input-sm input-bordered w-24"
                value={minPrice ?? ""}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
              <span> - </span>
              <input
                type="number"
                placeholder="Max"
                className="input input-sm input-bordered w-24"
                value={maxPrice ?? ""}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>
        </aside>

        {/* Product Display */}
        <div className="w-full md:w-3/4">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search product..."
              className="input input-bordered w-[40%]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts?.map((product) => (
              <div
                key={product.id}
                className="border rounded-xl p-4 shadow-sm hover:shadow-lg flex flex-col justify-between"
              >
                <Link to={`/product/${product.id}`} className="flex flex-col">
                  <img
                    src={"http://localhost:8080" + product.productImage}
                    alt={product.name}
                    className="h-40 w-full object-contain rounded-md mb-4 bg-white"
                  />
                  <div className="text-center mb-4">
                    <h2 className="text-pink-600 font-semibold text-base mb-1">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      In stock: {product.quantity}
                    </p>
                    <p className="text-gray-800 font-medium">
                      ${product.price}
                    </p>
                  </div>
                </Link>
                <button
                  className="btn btn-sm text-white w-full mt-auto bg-[#e63946]"
                  onClick={() => addProduct(Number(product.id))}
                >
                  Add to cart
                </button>
              </div>
            ))}
            {paginatedProducts?.length === 0 && (
              <p className="text-gray-500 col-span-full">No products found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>
            {[...Array(totalFilteredPages || 0)].map((_, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${
                  currentPage === idx + 1 ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="btn btn-sm"
              disabled={currentPage === totalFilteredPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
