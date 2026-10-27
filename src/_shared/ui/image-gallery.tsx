import * as React from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export interface GalleryImage {
  id: string;
  url: string;
  position: number;
}

// Any aspect ratio: the whole photo is shown (object-contain) over a blurred,
// cropped copy of itself, so portraits and panoramas both look intentional.
const Stage = ({
  url,
  alt,
  eager,
}: {
  url: string;
  alt: string;
  eager?: boolean;
}) => (
  <div className='relative h-full w-full overflow-hidden bg-sage-900'>
    <img
      src={url}
      alt=''
      aria-hidden
      className='absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl'
    />
    <img
      src={url}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      className='relative h-full w-full object-contain'
      draggable={false}
    />
  </div>
);

const useSwipe = (onLeft: () => void, onRight: () => void) => {
  const start = React.useRef<number | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) =>
      (start.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (start.current === null) return;
      const dx = e.changedTouches[0].clientX - start.current;
      if (Math.abs(dx) > 40) (dx < 0 ? onLeft : onRight)();
      start.current = null;
    },
  };
};

const NavButton = ({
  dir,
  onClick,
  className,
}: {
  dir: 'prev' | 'next';
  onClick: () => void;
  className?: string;
}) => {
  const { t } = useTranslation();
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type='button'
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={dir === 'prev' ? t('common.previous') : t('common.next')}
      className={cn(
        'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:scale-105 hover:bg-white',
        dir === 'prev' ? 'left-3' : 'right-3',
        className
      )}
    >
      <Icon className='h-5 w-5' />
    </button>
  );
};

export const ImageGallery = ({
  images,
  alt,
}: {
  images: GalleryImage[];
  alt: string;
}) => {
  const { t } = useTranslation();
  const sorted = React.useMemo(
    () => [...images].sort((a, b) => a.position - b.position),
    [images]
  );
  const [index, setIndex] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const count = sorted.length;
  const prev = React.useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count]
  );
  const next = React.useCallback(
    () => setIndex((i) => (i + 1) % count),
    [count]
  );
  const swipe = useSwipe(next, prev);

  React.useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, prev, next]);

  if (!count) return null;
  const current = sorted[Math.min(index, count - 1)];

  return (
    <div className='flex flex-col gap-3'>
      <div
        className='group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl shadow-soft sm:aspect-[16/10]'
        onClick={() => setLightbox(true)}
        {...swipe}
      >
        <Stage url={current.url} alt={`${alt} - ${index + 1}/${count}`} eager />
        {count > 1 && (
          <>
            <NavButton
              dir='prev'
              onClick={prev}
              className='sm:opacity-0 sm:group-hover:opacity-100'
            />
            <NavButton
              dir='next'
              onClick={next}
              className='sm:opacity-0 sm:group-hover:opacity-100'
            />
            <span className='absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold tabular-nums text-white'>
              {index + 1} / {count}
            </span>
          </>
        )}
        <span className='absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100'>
          <Expand className='h-4 w-4' />
        </span>
      </div>

      {count > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]'>
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type='button'
              onClick={() => setIndex(i)}
              aria-label={`${t('listing.photo')} ${i + 1}`}
              className={cn(
                'h-16 w-20 shrink-0 overflow-hidden rounded-lg ring-offset-2 ring-offset-background transition',
                i === index
                  ? 'ring-2 ring-primary'
                  : 'opacity-70 hover:opacity-100'
              )}
            >
              <img
                src={img.url}
                alt=''
                loading='lazy'
                className='h-full w-full object-cover'
              />
            </button>
          ))}
        </div>
      )}

      <DialogPrimitive.Root open={lightbox} onOpenChange={setLightbox}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/95 data-[state=open]:animate-in data-[state=open]:fade-in-0' />
          <DialogPrimitive.Content
            className='fixed inset-0 z-50 flex items-center justify-center outline-none'
            {...swipe}
          >
            <DialogPrimitive.Title className='sr-only'>
              {alt}
            </DialogPrimitive.Title>
            <img
              src={current.url}
              alt={alt}
              className='max-h-[92dvh] max-w-[96vw] object-contain'
            />
            {count > 1 && (
              <>
                <NavButton dir='prev' onClick={prev} />
                <NavButton dir='next' onClick={next} />
                <span className='absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm tabular-nums text-white'>
                  {index + 1} / {count}
                </span>
              </>
            )}
            <DialogPrimitive.Close
              className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25'
              aria-label={t('common.close')}
            >
              <X className='h-5 w-5' />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
};
