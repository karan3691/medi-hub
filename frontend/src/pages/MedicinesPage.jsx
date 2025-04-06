import SearchMedicines from "../components/medicines/search_medicines/SearchMedicines";
import FeaturedMedicines from "../components/medicines/FeaturedMedicines";

const MedicinesPage = () => {
  return (
    <div className="medicines-page">
      <SearchMedicines />
      <FeaturedMedicines />
    </div>
  );
};

export default MedicinesPage; 