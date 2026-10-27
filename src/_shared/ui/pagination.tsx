import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { Button } from './button';

// 1 … 4 5 [6] 7 8 … 20
const pagesToShow = (page: number, total: number): (number | '…')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set(
    [1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total)
  );
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) out.push('…');
    out.push(p);
  });
  return out;
};

export const Pagination = ({
  page,
  totalPages,
  onChange,
  className,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;
  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label={t('common.pagination')}
    >
      <Button
        variant='ghost'
        size='icon'
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label={t('common.previous')}
      >
        <ChevronLeft />
      </Button>
      {pagesToShow(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className='px-2 text-muted-foreground'>
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'ghost'}
            size='icon'
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className='tabular-nums'
          >
            {p}
          </Button>
        )
      )}
      <Button
        variant='ghost'
        size='icon'
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label={t('common.next')}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
};
