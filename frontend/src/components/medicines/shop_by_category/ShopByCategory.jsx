import React from "react";
import { Link } from "react-router-dom";
import { Category } from "../../../constants";
import {
  SkeletonLoading,
  useLoading,
} from "../../../import-export/ImportExport";

export default function ShopByCategory() {
  const loading = useLoading(1000);

  return (
    <section className="space-y-6 my-16 page-content">
      <div className="px-3 md:px-4 lg:px-6 py-2">
        <h2 className="text-2xl md:text-3xl text-dark_theme font-bold relative inline-block">
          Shop by Category
          <span className="absolute bottom-0 left-0 w-full h-1 bg-main_theme/60 rounded-full"></span>
        </h2>
        <p className="text-gray-600 mt-2">Browse our wide range of medications and healthcare products</p>
      </div>

      {/* cards section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 justify-items-center gap-6 px-3 md:px-4 lg:px-6 py-2">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoading key={index} type="category" />
            ))
          : Category.map((category, index) => (
              <Link
                key={index}
                to={`/medicines/shop_by_category${category.Url.toLowerCase()}`}
                className="w-full max-w-[180px] group"
              >
                <div className="bg-white h-full rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-main_theme/40 flex flex-col">
                  {/* image container */}
                  <div className="relative w-full aspect-square overflow-hidden bg-gray-50 p-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain mix-blend-multiply transition duration-300 ease-in-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 text-center bg-gradient-to-r from-main_theme/5 to-dark_theme/5 flex items-center justify-center min-h-[60px]">
                    <h2 className="text-base font-medium text-dark_theme transition-colors duration-300 group-hover:text-main_theme">
                      {category.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
