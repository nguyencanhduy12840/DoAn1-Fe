// src/pages/HomePage.tsx
import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FeaturedCategoriesCarousel from "../components/layout/FeaturedCategoriesCarousel";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero min-h-[70vh] bg-[#ffe5ec]">
          <div className="hero-content grid grid-cols-1 lg:grid-cols-2 w-full px-4 lg:px-16 gap-10">
            {/* Left image */}
            <div className="w-full h-full flex justify-center items-center">
              <img
                src="/images/banner.avif"
                className="w-full max-h-[400px] object-cover rounded-lg shadow-2xl"
                alt="Fresh Flowers"
              />
            </div>

            {/* Right content */}
            <div className="flex flex-col justify-center text-center lg:text-left">
              <h1 className="text-4xl font-bold text-pink-600">
                Send Flowers, Send Love
              </h1>
              <p className="py-6 text-lg">
                We provide the freshest and most beautiful bouquets for all your
                special moments.
              </p>
              <div className="flex justify-center lg:justify-start">
                <button className="btn  bg-[#f07167]">Shop Now</button>
              </div>
            </div>
          </div>
        </section>

        <FeaturedCategoriesCarousel />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
