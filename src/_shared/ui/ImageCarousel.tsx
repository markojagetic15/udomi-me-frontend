import { useState } from 'react';
import { Image } from '_entities/listing';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export const ImageCarousel = ({ images }: { images: Image[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sorted = [...images].sort((a, b) => a.position - b.position);

  const nextSlide = () => setCurrentIndex((i) => (i + 1) % sorted.length);
  const prevSlide = () => setCurrentIndex((i) => (i === 0 ? sorted.length - 1 : i - 1));

  return (
    <div className='relative w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg'>
      <div
        className='flex transition-transform duration-500 ease-in-out'
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sorted.map((image) => (
          <div
            key={image.id}
            style={{ backgroundImage: `url(${image.url})` }}
            className='h-[500px] w-full bg-cover bg-center bg-no-repeat flex-shrink-0'
          />
        ))}
      </div>

      {sorted.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all hover:scale-110'
            aria-label='Previous image'
          >
            <MdChevronLeft className='w-6 h-6 text-gray-700' />
          </button>
          <button
            onClick={nextSlide}
            className='absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all hover:scale-110'
            aria-label='Next image'
          >
            <MdChevronRight className='w-6 h-6 text-gray-700' />
          </button>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5'>
            {sorted.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
