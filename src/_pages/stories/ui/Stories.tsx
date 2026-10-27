import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Quote } from 'lucide-react';
import { categoryEmoji, firstImage } from '_entities/listing';
import { publicName } from '_entities/user';
import {
  Badge,
  Button,
  EmptyState,
  formatDate,
  PageHeader,
  Pagination,
  Skeleton,
} from '_shared';
import { useStories } from '../hooks';

export const Stories = () => {
  const { t } = useTranslation();
  const { stories, totalPages, total, isLoading, page, setPage } = useStories();

  return (
    <div className='container py-8 sm:py-10'>
      <PageHeader
        title={t('stories.title')}
        description={t('stories.subtitle', { count: total })}
      />
      {isLoading ? (
        <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-96' />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <EmptyState
          icon={<span className='text-3xl'>🏡</span>}
          title={t('stories.emptyTitle')}
          description={t('stories.emptyText')}
          action={
            <Button asChild>
              <Link to='/browse'>{t('landing.ctaBrowse')}</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {stories.map((s) => {
              const img = firstImage(s);
              return (
                <article
                  key={s.id}
                  className='flex flex-col overflow-hidden rounded-xl border bg-card shadow-soft'
                >
                  <Link
                    to={`/animal/${s.id}`}
                    className='group relative aspect-[4/3] overflow-hidden bg-muted'
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={s.title}
                        loading='lazy'
                        className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center text-6xl'>
                        {categoryEmoji(s.category)}
                      </div>
                    )}
                    <Badge variant='success' className='absolute left-3 top-3'>
                      {s.listing_type === 'adoption'
                        ? t('listing.adopted')
                        : t('listing.reunited')}
                    </Badge>
                  </Link>
                  <div className='flex flex-1 flex-col gap-3 p-5'>
                    <div>
                      <h2 className='font-display text-xl font-bold'>
                        {s.title}
                      </h2>
                      <p className='text-xs text-muted-foreground'>
                        {formatDate(s.adopted_at ?? s.updated_at)} ·{' '}
                        {publicName(s.user)}
                      </p>
                    </div>
                    {s.adoption_story ? (
                      <blockquote className='relative rounded-lg bg-sage-50 p-4 pl-10 text-sm leading-relaxed text-foreground/80'>
                        <Quote className='absolute left-3 top-4 h-4 w-4 text-sage-400' />
                        {s.adoption_story}
                      </blockquote>
                    ) : (
                      <p className='text-sm text-muted-foreground'>
                        {t('stories.noStory')}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
            className='mt-8'
          />
        </>
      )}
    </div>
  );
};
