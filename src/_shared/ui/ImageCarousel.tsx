import { useState } from 'react';

export const ImageCarousel = ({
  images,
}: {
  images: { id: string; url: string }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <div className='relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl'>
        <div
          className='flex transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images?.map((image) => (
            <div
              key={image.id}
              style={{ backgroundImage: `url(${image.url})` }}
              className={
                'h-[700px] w-full bg-cover bg-center bg-no-repeat rounded-2xl flex-shrink-0'
              }
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className='absolute top-1/2 left-2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200'
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className='absolute top-1/2 right-2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200'
            >
              ›
            </button>

            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
              {images?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full ${
                    currentIndex !== index ? 'bg-gray-800' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
