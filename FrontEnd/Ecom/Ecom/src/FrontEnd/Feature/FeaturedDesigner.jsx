import React from "react";
import p4 from "/Users/Light-Club/Ecom/src/FrontEnd/assets/p4.jpg";
import p5 from "/Users/Light-Club/Ecom/src/FrontEnd/assets/p5.jpg";
import p6 from "/Users/Light-Club/Ecom/src/FrontEnd/assets/p6.jpg";

const designers = [
  {
    name: "Tom Dixon",
    description: "Modern British Design",
    image: p4,
  },
  {
    name: "Nendo",
    description: "Japanese Minimalist Style",
    image: p5,
  },
  {
    name: "Marcel Wanders",
    description: "Bold and Creative",
    image: p6,
  },
];

export default function FeaturedDesigners() {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Featured Designers</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* First image: full width */}
        <div className="md:col-span-4 group overflow-hidden rounded shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="overflow-hidden">
            <img
              src={designers[0].image}
              alt={designers[0].name}
              className="w-full object-cover max-h-[450px] transform transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-xl font-semibold">{designers[0].name}</h3>
            <p className="text-sm text-gray-600">{designers[0].description}</p>
          </div>
        </div>

        {/* Second and Third images: 2 columns */}
        {designers.slice(1).map((designer, index) => (
          <div
            key={index}
            className="md:col-span-2 group overflow-hidden rounded shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="overflow-hidden">
              <img
                src={designer.image}
                alt={designer.name}
                className="w-full object-cover max-h-[300px] transform transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold">{designer.name}</h3>
              <p className="text-sm text-gray-600">{designer.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
