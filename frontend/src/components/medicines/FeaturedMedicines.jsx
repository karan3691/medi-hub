import React from 'react';
import ProductCard from './ProductCard';

// Sample medicine data - in a real app this would come from an API
export const medicines = [
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a1',
    name: 'Paracetamol 500mg Tablets',
    manufacturer: 'Sun Pharmaceuticals',
    price: 99.00,
    discountedPrice: 94.05,
    discount: 5,
    image: '/images/medicines/paracetamol.jpg',
    prescriptionNeeded: false,
    category: 'Tablet',
    description: 'Paracetamol is a commonly used pain reliever and fever reducer.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a2',
    name: 'Azithromycin 500mg Tablets',
    manufacturer: 'Cipla Ltd',
    price: 185.00,
    discountedPrice: 166.50,
    discount: 10,
    image: '/images/medicines/azithromycin.jpg',
    prescriptionNeeded: true,
    category: 'Tablet',
    description: 'Azithromycin is used to treat a wide variety of bacterial infections.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a3',
    name: 'Crocin Advance Tablets',
    manufacturer: 'GlaxoSmithKline',
    price: 75.00,
    discountedPrice: 71.25,
    discount: 5,
    image: '/images/medicines/crocin.jpg',
    prescriptionNeeded: false,
    category: 'Tablet',
    description: 'Crocin contains Paracetamol, which provides relief from pain and reduces fever.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a4',
    name: 'Vicks VapoRub',
    manufacturer: 'Procter & Gamble',
    price: 145.00,
    discountedPrice: 130.50,
    discount: 10,
    image: '/images/medicines/vicks-vaporub.jpg',
    prescriptionNeeded: false,
    category: 'Cream',
    description: 'Vicks VapoRub is a mentholated topical cream that relieves cough and congestion symptoms.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a5',
    name: 'Dolo 650',
    manufacturer: 'Micro Labs',
    price: 85.00,
    discountedPrice: 80.75,
    discount: 5,
    image: '/images/medicines/dolo.jpg',
    prescriptionNeeded: false,
    category: 'Tablet',
    description: 'Dolo 650 is a tablet that contains Paracetamol which helps relieve pain and reduce fever.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a6',
    name: 'Band-Aid Adhesive Bandages',
    manufacturer: 'Johnson & Johnson',
    price: 120.00,
    discountedPrice: 108.00,
    discount: 10,
    image: '/images/medicines/band-aid.jpg',
    prescriptionNeeded: false,
    category: 'First Aid',
    description: 'Band-Aid brand adhesive bandages protect minor wounds and help them heal quickly.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a7',
    name: 'Volini Spray',
    manufacturer: 'Sun Pharma',
    price: 220.00,
    discountedPrice: 209.00,
    discount: 5,
    image: '/images/medicines/volini.jpg',
    prescriptionNeeded: false,
    category: 'Spray',
    description: 'Volini spray provides quick relief from muscle pains and sprains.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a8',
    name: 'Digene Tablets',
    manufacturer: 'Abbott',
    price: 110.00,
    discountedPrice: 99.00,
    discount: 10,
    image: '/images/medicines/digene.jpg',
    prescriptionNeeded: false,
    category: 'Tablet',
    description: 'Digene is an antacid that helps relieve acidity, heartburn, and indigestion.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1a9',
    name: 'Dettol Antiseptic Liquid',
    manufacturer: 'Reckitt Benckiser',
    price: 150.00,
    discountedPrice: 127.50,
    discount: 15,
    image: '/images/medicines/dettol_antispectic_liquid.jpg',
    prescriptionNeeded: false,
    category: 'Antiseptic',
    description: 'Dettol Antiseptic Liquid protects against infection from cuts and wounds.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1b0',
    name: 'Allegra 120mg Tablets',
    manufacturer: 'Sanofi India',
    price: 165.00,
    discountedPrice: 148.50,
    discount: 10,
    image: '/images/medicines/allegra-120mg-tablet-box-front-1.webp',
    prescriptionNeeded: false,
    category: 'Tablet',
    description: 'Allegra is an antihistamine used to relieve allergy symptoms such as watery eyes and runny nose.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1b1',
    name: 'Paracetamol Syrup',
    manufacturer: 'Cipla',
    price: 60.00,
    discountedPrice: 57.00,
    discount: 5,
    image: '/images/medicines/paracetamol-syrup.jpg',
    prescriptionNeeded: false,
    category: 'Syrup',
    description: 'Paracetamol syrup for children, provides effective relief from fever and pain.'
  },
  {
    id: 'med_60f0a3b0e1b7c820b4b0f1b2',
    name: 'Aspirin 75mg Tablets',
    manufacturer: 'Bayer',
    price: 45.00,
    discountedPrice: 42.75,
    discount: 5,
    image: '/images/medicines/aspirin-tablet.jpeg',
    prescriptionNeeded: true,
    category: 'Tablet',
    description: 'Low-dose aspirin helps prevent blood clots and reduce the risk of heart attack and stroke.'
  }
];

const FeaturedMedicines = () => {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark_theme mb-3">Popular Medicines</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our selection of most popular medications and healthcare products
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map(medicine => (
            <ProductCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMedicines; 