import React, { useEffect, useState } from "react";

import { getAllProductsExist } from "../../services/api";
import { Product } from "../../types/Product";

const FeaturedCategoriesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  console.log(featuredProducts);
  const groupSize = 3;
  const totalGroups = Math.ceil(featuredProducts.length / groupSize);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalGroups);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalGroups]);

  useEffect(() => {
    const fetchAllProductExist = async () => {
      const res = await getAllProductsExist({ page: "0", size: "100" });
      setFeaturedProducts(res.data.result);
    };

    fetchAllProductExist();
  }, []);

  const currentGroup = featuredProducts.slice(
    currentIndex * groupSize,
    currentIndex * groupSize + groupSize
  );

  return (
    <section className="py-10 bg-white text-center overflow-hidden">
      <h2 className="text-3xl font-semibold mb-6 text-pink-600">
        Featured Products
      </h2>

      <div className="w-full transition-transform duration-700 ease-in-out transform">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {currentGroup.map((item) => (
            <div
              key={item.id}
              className="card bg-base-100 shadow-xl transition-all duration-500 transform hover:scale-105"
            >
              <figure className="w-full h-60 flex items-center justify-center bg-white">
                <img
                  src={"http://localhost:8080" + item.productImage}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategoriesCarousel;
