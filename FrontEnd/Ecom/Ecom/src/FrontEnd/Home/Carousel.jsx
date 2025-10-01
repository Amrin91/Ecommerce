import React from "react";
import p1 from "/Users/Light-Club/Ecom/src/FrontEnd/assets/p1.jpg";
import p2 from "/Users/Light-Club/Ecom/src/FrontEnd/assets/p2.jpg";

export default function Carousel() {
  return (
    <div>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
      >
        {/* Slides */}
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          <div
            className="duration-700 ease-in-out"
            data-carousel-item="active" // ✅ Make this active by default
          >
            <img
              src={p1}
              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="Slide 1"
            />
          </div>
          <div
            className="hidden duration-700 ease-in-out"
            data-carousel-item
          >
            <img
              src={p2}
              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="Slide 2"
            />
          </div>
          <div
            className="hidden duration-700 ease-in-out"
            data-carousel-item
          >
            <img
              src={p1}
              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="Slide 3"
            />
          </div>
        </div>

        {/* Dots */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-white"
            aria-label="Slide 1"
            data-carousel-slide-to="0"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-white"
            aria-label="Slide 2"
            data-carousel-slide-to="1"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-white"
            aria-label="Slide 3"
            data-carousel-slide-to="2"
          ></button>
        </div>

        {/* Navigation */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
}
