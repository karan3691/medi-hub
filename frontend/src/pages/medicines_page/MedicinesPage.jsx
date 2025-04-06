import React from "react";
import { Link } from "react-router-dom";
import { SearchMedicines } from "../../import-export/ImportExport";
import { medicines } from "../../components/medicines/FeaturedMedicines";
import ProductCard from "../../components/medicines/ProductCard";

function MedicinesPage() {
  return (
    <main className="w-full">
      <SearchMedicines />
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-dark_theme mb-2">
            All Medicines
          </h1>
          <p className="text-gray-600">
            Browse our comprehensive collection of high-quality medicines
          </p>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map(medicine => (
            <ProductCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </section>
    </main>
  );
}
export default MedicinesPage;
