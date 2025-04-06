import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaPills } from "react-icons/fa";
import { MdLocalPharmacy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { medicines } from "../FeaturedMedicines";
import ProductCard from "../ProductCard";

export default function SearchMedicines() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setSearching(true);
    
    // Filter medicines based on search term
    const results = medicines.filter(med => 
      med.name.toLowerCase().includes(search.toLowerCase()) || 
      med.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      med.category.toLowerCase().includes(search.toLowerCase()) ||
      med.description.toLowerCase().includes(search.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setSearching(false);
  };

  return (
    <section className="bg-gradient-to-r from-dark_theme to-main_theme/90 min-h-[300px] flex justify-center items-center flex-col gap-6 py-12 px-4 -mt-1 relative">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md">
          Buy Medicines and Essentials
        </h1>
        <p className="text-white/90 text-lg mb-6">
          Find prescription medications, over-the-counter products, and healthcare essentials
        </p>
      </div>
      
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center w-full rounded-lg focus-within:shadow-lg bg-white overflow-hidden border-2 border-white/20">
            <div className="grid place-items-center h-14 w-12 text-gray-500">
              <FaSearch className="h-5 w-5" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 w-full outline-none text-base text-gray-700 pr-2"
              type="text"
              id="search"
              placeholder="Search for medicines, health products..."
            />
            <button 
              type="submit"
              className="h-14 px-6 bg-main_theme text-white font-medium hover:bg-main_theme/90 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Features section */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4 text-white max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <FaPills className="text-white/90 text-lg" />
          <span className="text-sm md:text-base">Genuine Medicines</span>
        </div>
        <div className="flex items-center gap-2">
          <MdLocalPharmacy className="text-white/90 text-lg" />
          <span className="text-sm md:text-base">Free Home Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-white/90 text-lg" />
          <span className="text-sm md:text-base">PAN India Delivery</span>
        </div>
      </div>
      
      {/* Search Results */}
      {searching && (
        <div className="w-full max-w-7xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-dark_theme">
              Search Results for "{search}" ({searchResults.length})
            </h2>
            <button 
              onClick={clearSearch}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Clear Results
            </button>
          </div>
          
          {searchResults.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">No medicines found matching your search.</p>
              <button 
                onClick={() => navigate("/medicines")}
                className="text-main_theme hover:underline font-medium"
              >
                Browse all medicines
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map(medicine => (
                <ProductCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
