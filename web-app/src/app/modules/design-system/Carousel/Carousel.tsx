import { useState } from "react";
import { classNames } from "../styles";

export const Carousel = ({
  data,
}: {
  data: { title: string; content: React.ReactNode }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // State to manage current index
  const [touchStartX, setTouchStartX] = useState<null | number>(null); // State to store initial touch position

  // Function to handle next button click
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  // Function to handle previous button click
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  // Touch swipe event handlers
  const handleTouchStart = (currentX: number) => {
    if (data.length < 2) {
      return;
    }
    setTouchStartX(currentX);
  };

  const handleTouchMove = (currentX: number) => {
    if (data.length < 2) {
      return;
    }
    if (touchStartX === null) {
      return;
    }
    const difference = touchStartX - currentX;

    // Swipe left
    if (difference > 5) {
      nextSlide();
    }

    // Swipe right
    if (difference < -5) {
      prevSlide();
    }

    setTouchStartX(null);
  };

  return (
    <div className="container mx-auto rounded-2xl border border-gray-200 bg-gray-100 p-4 px-4 ">
      <div className="relative">
        <div
          className={classNames(
            "mb-4 flex items-center",
            data.length > 1 ? "justify-between" : "justify-center",
          )}
        >
          {data.length > 1 && (
            <button
              onClick={prevSlide}
              className="select-none text-black focus:outline-none"
            >
              {"<"}
            </button>
          )}
          <div className="select-none text-sm font-bold">
            {data[currentIndex].title}
          </div>
          {data.length > 1 && (
            <button
              onClick={nextSlide}
              className="select-none text-black focus:outline-none"
            >
              {">"}
            </button>
          )}
        </div>
        <div
          onTouchStart={(e) => {
            handleTouchStart(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            handleTouchMove(e.touches[0].clientX);
          }}
          onTouchEnd={() => setTouchStartX(null)}
        >
          {data[currentIndex].content}
        </div>
      </div>
    </div>
  );
};
