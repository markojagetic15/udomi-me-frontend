import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  MessageCircle,
  Search,
  SearchCheck,
} from 'lucide-react';
import {
  CATEGORIES,
  firstImage,
  ListingGrid,
  ListingGridSkeleton,
} from '_entities/listing';
import { Button, Card } from '_shared';
import { useLanding } from '../hooks';

const HeroCollage = ({ images }: { images: string[] }) => {
  const tiles = [0, 1, 2].map((i) => images[i]);
  const emoji = ['🐕', '🐈', '🐇'];
  const pos = [
    'left-0 top-6 w-[58%] rotate-[-4deg]',
    'right-0 top-0 w-[46%] rotate-[5deg]',
    'bottom-0 left-[22%] w-[52%] rotate-[2deg]',
  ];
  return (
    <div className='relative mx-auto aspect-square w-full max-w-md' aria-hidden>
      <div className='absolute inset-8 rounded-full bg-sage-200/60 blur-3xl' />
      {tiles.map((src, i) => (
        <div
          key={i}
          className={`absolute aspect-[4/5] overflow-hidden rounded-2xl border-4 border-card bg-sage-100 shadow-lift ${pos[i]}`}
        >
          {src ? (
            <img src={src} alt='' className='h-full w-full object-cover' />
          ) : (
            <div className='flex h-full items-center justify-center text-6xl'>
              {emoji[i]}
            </div>
          )}
        </div>
      ))}
      <span className='absolute -left-2 bottom-10 animate-float rounded-full bg-card px-3 py-2 text-sm font-semibold shadow-lift'>
        🐾 Udomi me
      </span>
    </div>
  );
};

const Step = ({
  n,
  icon,
  title,
  text,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <Card className='relative p-6'>
    <span className='absolute right-5 top-4 font-display text-5xl font-black text-sage-100'>
      {n}
    </span>
    <span className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary [&_svg]:h-6 [&_svg]:w-6'>
      {icon}
    </span>
    <h3 className='mb-1.5 text-lg font-bold'>{title}</h3>
    <p className='text-sm text-muted-foreground'>{text}</p>
  </Card>
);

export const Landing = () => {
  const { t } = useTranslation();
  const {
    isLoggedIn,
    listings,
    isLoading,
    heroImages,
    availableCount,
    adoptedCount,
    lostCount,
    stories,
  } = useLanding();

  return (
    <div>
      {/* Hero */}
      <section className='relative overflow-hidden'>
        <div className='bg-paws absolute inset-0' />
        <div className='container relative grid items-center gap-10 py-12 md:grid-cols-2 md:py-20'>
          <div>
            <span className='mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-primary'>
              <HeartHandshake className='h-4 w-4' /> {t('landing.badge')}
            </span>
            <h1 className='text-balance text-4xl font-black leading-[1.08] sm:text-5xl lg:text-6xl'>
              {t('landing.title1')}{' '}
              <span className='text-primary'>{t('landing.title2')}</span>
            </h1>
            <p className='mt-5 max-w-lg text-lg text-muted-foreground'>
              {t('landing.subtitle')}
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              <Button size='lg' asChild>
                <Link to='/browse'>
                  {t('landing.ctaBrowse')} <ArrowRight />
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link to={isLoggedIn ? '/create-listing' : '/register'}>
                  {isLoggedIn
                    ? t('nav.createListing')
                    : t('landing.ctaRegister')}
                </Link>
              </Button>
            </div>
            <div className='mt-8 flex flex-wrap gap-2'>
              {CATEGORIES.slice(0, 6).map((c) => (
                <Link
                  key={c.key}
                  to={`/browse?category=${c.key}`}
                  className='inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-medium shadow-sm transition hover:border-primary hover:text-primary'
                >
                  <span aria-hidden>{c.emoji}</span> {t(`category.${c.key}`)}
                </Link>
              ))}
            </div>
          </div>
          <HeroCollage images={heroImages} />
        </div>
      </section>

      {/* Live numbers — each shown only once it's non-zero. */}
      {availableCount + adoptedCount > 0 && (
        <section className='border-y bg-card'>
          <div className='container flex flex-wrap justify-around gap-6 py-8 text-center'>
            {availableCount > 0 && (
              <div>
                <p className='font-display text-3xl font-black text-primary sm:text-4xl'>
                  {availableCount}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {t('landing.statAvailable')}
                </p>
              </div>
            )}
            {adoptedCount > 0 && (
              <div>
                <p className='font-display text-3xl font-black text-primary sm:text-4xl'>
                  {adoptedCount}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {t('landing.statAdopted')}
                </p>
              </div>
            )}
            <div>
              <p className='font-display text-3xl font-black text-primary sm:text-4xl'>
                0 €
              </p>
              <p className='text-sm text-muted-foreground'>
                {t('landing.statFree')}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Recent */}
      <section className='container py-14 sm:py-20'>
        <div className='mb-8 flex items-end justify-between gap-4'>
          <div>
            <h2 className='text-3xl font-extrabold'>
              {t('landing.recentTitle')}
            </h2>
            <p className='mt-1 text-muted-foreground'>
              {t('landing.recentSubtitle')}
            </p>
          </div>
          <Button variant='ghost' asChild className='hidden sm:inline-flex'>
            <Link to='/browse'>
              {t('landing.seeAll')} <ArrowRight />
            </Link>
          </Button>
        </div>
        {isLoading ? (
          <ListingGridSkeleton count={4} />
        ) : listings.length ? (
          <ListingGrid listings={listings} />
        ) : (
          <Card className='flex flex-col items-center gap-3 p-10 text-center'>
            <span className='text-5xl'>🐾</span>
            <p className='font-semibold'>{t('landing.emptyTitle')}</p>
            <Button asChild>
              <Link to='/create-listing'>{t('landing.emptyCta')}</Link>
            </Button>
          </Card>
        )}
        <Button variant='outline' asChild className='mt-6 w-full sm:hidden'>
          <Link to='/browse'>{t('landing.seeAll')}</Link>
        </Button>
      </section>

      {/* How it works */}
      <section className='bg-sage-50 py-14 sm:py-20'>
        <div className='container'>
          <h2 className='mb-2 text-center text-3xl font-extrabold'>
            {t('landing.howTitle')}
          </h2>
          <p className='mx-auto mb-10 max-w-xl text-center text-muted-foreground'>
            {t('landing.howSubtitle')}
          </p>
          <div className='grid gap-5 md:grid-cols-3'>
            <Step
              n={1}
              icon={<Search />}
              title={t('landing.step1Title')}
              text={t('landing.step1Text')}
            />
            <Step
              n={2}
              icon={<MessageCircle />}
              title={t('landing.step2Title')}
              text={t('landing.step2Text')}
            />
            <Step
              n={3}
              icon={<HeartHandshake />}
              title={t('landing.step3Title')}
              text={t('landing.step3Text')}
            />
          </div>
        </div>
      </section>

      {/* Lost & found + shelters */}
      <section className='container grid gap-5 py-14 sm:py-20 md:grid-cols-2'>
        <Card className='flex flex-col justify-between gap-6 overflow-hidden bg-gradient-to-br from-terracotta-50 to-card p-7'>
          <div>
            <span className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-100 text-terracotta-700'>
              <SearchCheck className='h-6 w-6' />
            </span>
            <h2 className='text-2xl font-extrabold'>
              {t('landing.lostTitle')}
            </h2>
            <p className='mt-2 text-muted-foreground'>
              {t('landing.lostText')}
            </p>
            {lostCount > 0 && (
              <p className='mt-3 text-sm font-semibold text-terracotta-700'>
                {t('landing.lostCount', { count: lostCount })}
              </p>
            )}
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button variant='warm' asChild>
              <Link to='/lost-found'>{t('landing.lostCta')}</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link to='/create-listing?type=lost'>
                {t('landing.lostReport')}
              </Link>
            </Button>
          </div>
        </Card>
        <Card className='flex flex-col justify-between gap-6 bg-gradient-to-br from-sage-100 to-card p-7'>
          <div>
            <span className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-200 text-primary'>
              <BadgeCheck className='h-6 w-6' />
            </span>
            <h2 className='text-2xl font-extrabold'>
              {t('landing.shelterTitle')}
            </h2>
            <p className='mt-2 text-muted-foreground'>
              {t('landing.shelterText')}
            </p>
          </div>
          <Button asChild className='self-start'>
            <Link to={isLoggedIn ? '/profile?tab=settings' : '/register'}>
              {t('landing.shelterCta')}
            </Link>
          </Button>
        </Card>
      </section>

      {/* Stories */}
      {stories.length > 0 && (
        <section className='bg-sage-50 py-14 sm:py-20'>
          <div className='container'>
            <div className='mb-8 flex items-end justify-between gap-4'>
              <h2 className='text-3xl font-extrabold'>
                {t('landing.storiesTitle')}
              </h2>
              <Button variant='ghost' asChild>
                <Link to='/stories'>
                  {t('landing.seeAll')} <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className='grid gap-5 md:grid-cols-3'>
              {stories.map((s) => (
                <Link
                  key={s.id}
                  to={`/animal/${s.id}`}
                  className='group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:shadow-lift'
                >
                  <div className='aspect-[16/10] overflow-hidden bg-muted'>
                    {firstImage(s) && (
                      <img
                        src={firstImage(s)!}
                        alt={s.title}
                        loading='lazy'
                        className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                      />
                    )}
                  </div>
                  <div className='p-5'>
                    <p className='font-display text-lg font-bold'>
                      {s.title} 🏡
                    </p>
                    {s.adoption_story && (
                      <p className='mt-1.5 line-clamp-3 text-sm text-muted-foreground'>
                        “{s.adoption_story}”
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className='container py-14 sm:py-20'>
        <div className='relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16'>
          <div className='bg-paws absolute inset-0 opacity-40 mix-blend-overlay' />
          <h2 className='relative text-balance text-3xl font-extrabold sm:text-4xl'>
            {t('landing.finalTitle')}
          </h2>
          <p className='relative mx-auto mt-3 max-w-xl text-primary-foreground/80'>
            {t('landing.finalText')}
          </p>
          <div className='relative mt-8 flex flex-wrap justify-center gap-3'>
            <Button size='lg' variant='secondary' asChild>
              <Link to='/browse'>{t('landing.ctaBrowse')}</Link>
            </Button>
            <Button
              size='lg'
              variant='outline'
              asChild
              className='border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white'
            >
              <Link to='/create-listing'>{t('nav.createListing')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
