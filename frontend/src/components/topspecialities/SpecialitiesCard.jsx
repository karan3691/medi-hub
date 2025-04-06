import React from "react";
import { SkeletonLoading, useLoading } from "../../import-export/ImportExport";

const SpecialitiesCard = ({ speciality }) => {
  const loading = useLoading(1000);
  if (loading || !speciality) return <SkeletonLoading type="speciality" />;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="p-6 flex flex-col items-center text-center h-full">
        {/* Icon */}
        <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gray-50 p-1">
          <img 
            src={speciality.icon} 
            alt={`${speciality.name} icon`} 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-dark_theme mb-2">
          {speciality.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {speciality.desc}
        </p>

        {/* Symptoms */}
        <div className="mt-auto">
          <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Common Issues</h4>
          <p className="text-sm text-main_theme">
            {speciality.symptoms.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecialitiesCard;
