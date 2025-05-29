import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../types/Product";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/products/${id}`)
        .then((response) => response.json())
        .then((data) => setProduct(data.data))
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [id]);

  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product?.name} to the cart.`);
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row items-start px-4 py-8 gap-8">
        {/* Left Side: 60% */}
        <div className="w-full md:w-[60%]">
          <h2 className="text-2xl font-semibold text-pink-600 mb-2">
            {product.name}
          </h2>
          <p className="text-xl text-gray-800 mb-4">${product.price}</p>

          <div className="mt-6 mb-20">
            <h3 className="font-medium text-xl text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleDecrease} className="btn btn-sm btn-outline">
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="input input-bordered w-20 text-center"
            />
            <button onClick={handleIncrease} className="btn btn-sm btn-outline">
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn w-[30%] mt-4 py-3 text-lg bg-[#e63946] text-white"
          >
            Add to Cart
          </button>
        </div>

        {/* Right Side: 40% */}
        <div className="w-full md:w-[40%] h-96 flex items-center justify-center bg-white rounded-lg shadow-md">
          <img
            src={"http://localhost:8080" + product.productImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
