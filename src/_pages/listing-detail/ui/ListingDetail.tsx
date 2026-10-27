import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  EyeOff,
  Flag,
  HandHeart,
  Mail,
  MapPin,
  PartyPopper,
  Pause,
  Phone,
  Ruler,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useSetListingHidden } from '_entities/admin';
import {
  categoryEmoji,
  FavoriteButton,
  Listing,
  ListingGrid,
} from '_entities/listing';
import {
  isVerifiedShelter,
  publicName,
  ShelterBadge,
  UserAvatar,
} from '_entities/user';
import {
  ContactOwnerButton,
  OwnerActions,
  ReportDialog,
  ShareButtons,
} from '_features/listing-actions';
import {
  Badge,
  Button,
  Card,
  formatAge,
  formatDate,
  formatPrice,
  ImageGallery,
  PageLoader,
  Separator,
} from '_shared';
import { ErrorPage } from '_pages/error';
import { useListingDetail } from '../hooks';
import { ListingMap } from './ListingMap';

const Fact = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className='flex items-center gap-3 rounded-lg bg-muted/60 p-3'>
    <span className='text-primary [&_svg]:h-5 [&_svg]:w-5'>{icon}</span>
    <span className='min-w-0'>
      <span className='block text-xs text-muted-foreground'>{label}</span>
      <span className='block break-words text-sm font-semibold'>{value}</span>
    </span>
  </div>
);

// The form's checkboxes mean "yes" vs "not stated" — so only confirmed traits
// are shown; an unticked box must not read as "no".
const Trait = ({ ok, label }: { ok: boolean | null; label: string }) =>
  ok ? (
    <span className='inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground'>
      <Check className='h-4 w-4 text-primary' /> {label}
    </span>
  ) : null;

const StatusBanner = ({ listing }: { listing: Listing }) => {
  const { t } = useTranslation();
  if (listing.is_hidden)
    return (
      <div className='flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive'>
        <EyeOff className='h-5 w-5 shrink-0' /> {t('detail.hiddenBanner')}
      </div>
    );
  if (listing.is_adopted)
    return (
      <div className='flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800'>
        <PartyPopper className='h-5 w-5 shrink-0' />
        {listing.listing_type === 'adoption'
          ? t('detail.adoptedBanner')
          : t('detail.reunitedBanner')}
      </div>
    );
  if (listing.is_active === false)
    return (
      <div className='flex items-center gap-3 rounded-xl border bg-muted p-4 text-sm text-muted-foreground'>
        <Pause className='h-5 w-5 shrink-0' /> {t('detail.pausedBanner')}
      </div>
    );
  return null;
};

export const ListingDetail = () => {
  const { t } = useTranslation();
  const d = useListingDetail();
  const { run: setHidden, isPending: hiding } = useSetListingHidden();

  if (d.isLoading) return <PageLoader />;
  if (d.isError || !d.listing) return <ErrorPage code={404} />;
  const l = d.listing;
  const isAdoption = l.listing_type === 'adoption';
  const owner = l.user;
  const ownerName = publicName(owner);
  const age = formatAge(l.date_of_birth, t);
  const price = formatPrice(l.adoption_fee, t);
  const closed = l.is_adopted || l.is_active === false || l.is_hidden;

  const healthTraits = [
    [l.is_vaccinated, t('traits.vaccinated')],
    [l.is_sterilized, t('traits.sterilized')],
    [l.is_microchipped, t('traits.microchipped')],
  ] as const;
  const temperament = [
    [l.good_with_kids, t('traits.goodWithKids')],
    [l.good_with_dogs, t('traits.goodWithDogs')],
    [l.good_with_cats, t('traits.goodWithCats')],
  ] as const;
  const hasHealth = healthTraits.some(([v]) => !!v);
  const hasTemperament = temperament.some(([v]) => !!v);
  const hasTraits = hasHealth || (isAdoption && hasTemperament);

  return (
    <div className='container py-6 sm:py-8'>
      <Button
        variant='ghost'
        size='sm'
        onClick={d.goBack}
        className='-ml-2 mb-4'
      >
        <ArrowLeft /> {t('common.back')}
      </Button>

      <div className='grid gap-8 lg:grid-cols-[1fr_380px]'>
        {/* Main column */}
        <div className='flex min-w-0 flex-col gap-6'>
          <StatusBanner listing={l} />
          <ImageGallery images={l.images} alt={l.title} />

          {/* Mobile title block (desktop shows it in the sidebar) */}
          <div className='lg:hidden'>
            <TitleBlock listing={l} />
          </div>

          <Card className='p-5 sm:p-6'>
            <h2 className='mb-3 text-xl font-bold'>
              {isAdoption
                ? t('detail.about', { name: l.title })
                : t('detail.details')}
            </h2>
            <p className='whitespace-pre-line leading-relaxed text-foreground/85'>
              {l.description}
            </p>

            <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3'>
              <Fact
                icon={
                  <span className='text-lg not-italic'>
                    {categoryEmoji(l.category)}
                  </span>
                }
                label={t('detail.species')}
                value={t(`category.${l.category}`)}
              />
              <Fact
                icon={<Users />}
                label={t('detail.gender')}
                value={t(`gender.${l.gender ?? 'unknown'}`)}
              />
              {age && (
                <Fact
                  icon={<Calendar />}
                  label={t('detail.age')}
                  value={`${age} · ${formatDate(l.date_of_birth)}`}
                />
              )}
              {!isAdoption && l.event_date && (
                <Fact
                  icon={<Clock />}
                  label={t(`detail.eventDate.${l.listing_type}`)}
                  value={formatDate(l.event_date)}
                />
              )}
              {!!l.size && (
                <Fact
                  icon={<Ruler />}
                  label={t('detail.weight')}
                  value={`${l.size} kg`}
                />
              )}
              {l.breed && (
                <Fact
                  icon={<HandHeart />}
                  label={t('detail.breed')}
                  value={l.breed}
                />
              )}
              {isAdoption && price && (
                <Fact
                  icon={<span className='font-bold'>€</span>}
                  label={t('detail.fee')}
                  value={price}
                />
              )}
            </div>

            {hasTraits && (
              <>
                <Separator className='my-6' />
                <div className='flex flex-col gap-4'>
                  {hasHealth && (
                    <div>
                      <h3 className='mb-2.5 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
                        {t('filters.health')}
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {healthTraits.map(([v, label]) => (
                          <Trait key={label} ok={v} label={label} />
                        ))}
                      </div>
                    </div>
                  )}
                  {isAdoption && hasTemperament && (
                    <div>
                      <h3 className='mb-2.5 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
                        {t('filters.temperament')}
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {temperament.map(([v, label]) => (
                          <Trait key={label} ok={v} label={label} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {l.medical_notes && (
              <div className='mt-6 flex gap-3 rounded-lg bg-sage-50 p-4 text-sm'>
                <Stethoscope className='h-5 w-5 shrink-0 text-primary' />
                <div>
                  <p className='font-semibold'>{t('detail.medicalNotes')}</p>
                  <p className='mt-1 whitespace-pre-line text-foreground/80'>
                    {l.medical_notes}
                  </p>
                </div>
              </div>
            )}

            {l.is_adopted && l.adoption_story && (
              <div className='mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900'>
                <p className='mb-1 font-semibold'>{t('detail.story')}</p>
                <p className='whitespace-pre-line'>{l.adoption_story}</p>
              </div>
            )}
          </Card>

          {d.point && (
            <Card className='p-5 sm:p-6'>
              <h2 className='mb-1 text-xl font-bold'>{t('detail.location')}</h2>
              <p className='mb-4 flex items-center gap-1.5 text-sm text-muted-foreground'>
                <MapPin className='h-4 w-4' /> {l.address || l.city} ·{' '}
                {t('detail.approximate')}
              </p>
              <ListingMap lat={d.point.lat} lng={d.point.lng} />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <aside className='flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start'>
          <Card className='flex flex-col gap-5 p-5 sm:p-6'>
            <div className='hidden lg:block'>
              <TitleBlock listing={l} />
            </div>

            {d.isOwner ? (
              <div className='flex flex-col gap-3'>
                <p className='rounded-lg bg-secondary p-3 text-sm text-secondary-foreground'>
                  {t('detail.yourListing', {
                    count: l.number_of_interested_users,
                  })}
                </p>
                <OwnerActions
                  listing={l}
                  afterDelete={() => (window.location.href = '/profile')}
                />
              </div>
            ) : (
              !closed && (
                <div className='flex flex-col gap-2.5'>
                  {owner && (
                    <ContactOwnerButton
                      listing={l}
                      ownerName={owner.first_name}
                      className='w-full'
                    />
                  )}
                  <div className='flex gap-2'>
                    {isAdoption && (
                      <Button
                        variant={d.isInterested ? 'secondary' : 'outline'}
                        className='h-11 flex-1'
                        onClick={d.toggleInterest}
                        loading={d.isInterestPending}
                        aria-pressed={d.isInterested}
                      >
                        <HandHeart />{' '}
                        {d.isInterested
                          ? t('detail.interested')
                          : t('detail.imInterested')}
                      </Button>
                    )}
                    <FavoriteButton
                      listing={l}
                      size='lg'
                      className='shrink-0'
                    />
                    <ShareButtons title={l.title} />
                  </div>
                  {isAdoption && l.number_of_interested_users > 0 && (
                    <p className='text-center text-xs text-muted-foreground'>
                      {t('detail.interestCount', {
                        count: l.number_of_interested_users,
                      })}
                    </p>
                  )}
                </div>
              )
            )}
            {closed && !d.isOwner && <ShareButtons title={l.title} />}

            {(l.phone_number || l.email) && !closed && !d.isOwner && (
              <>
                <Separator />
                <div className='flex flex-col gap-2 text-sm'>
                  {l.phone_number &&
                    (d.phoneShown ? (
                      <a
                        href={`tel:${l.phone_number.replace(/\s/g, '')}`}
                        className='flex items-center gap-2 font-semibold text-primary'
                      >
                        <Phone className='h-4 w-4' /> {l.phone_number}
                      </a>
                    ) : (
                      <Button
                        variant='ghost'
                        className='justify-start'
                        onClick={d.showPhone}
                      >
                        <Phone /> {t('detail.showPhone')}
                      </Button>
                    ))}
                  {l.email && (
                    <a
                      href={`mailto:${l.email}`}
                      className='flex items-center gap-2 px-4 text-primary hover:underline'
                    >
                      <Mail className='h-4 w-4' /> {l.email}
                    </a>
                  )}
                </div>
              </>
            )}
          </Card>

          {owner && (
            <Card className='p-5'>
              <Link
                to={`/users/${owner.id}`}
                className='flex items-center gap-3 rounded-lg transition hover:opacity-80'
              >
                <UserAvatar
                  name={ownerName}
                  url={owner.avatar_url}
                  className='h-12 w-12'
                />
                <div className='min-w-0'>
                  <p className='truncate font-semibold'>{ownerName}</p>
                  <p className='text-xs text-muted-foreground'>
                    {t('detail.memberSince', {
                      date: formatDate(owner.created_at),
                    })}
                  </p>
                </div>
                {isVerifiedShelter(owner) && (
                  <ShelterBadge compact className='ml-auto' />
                )}
              </Link>
              {isVerifiedShelter(owner) && owner.shelter_description && (
                <p className='mt-3 line-clamp-3 text-sm text-muted-foreground'>
                  {owner.shelter_description}
                </p>
              )}
            </Card>
          )}

          <div className='flex items-start gap-2 rounded-xl bg-sage-50 p-4 text-xs text-muted-foreground'>
            <AlertTriangle className='h-4 w-4 shrink-0 text-sage-600' />
            <p>{t('detail.safetyTip')}</p>
          </div>

          {!d.isOwner && d.isLoggedIn && (
            <Button
              variant='ghost'
              size='sm'
              className='self-center text-muted-foreground'
              onClick={d.openReport}
            >
              <Flag /> {t('report.title')}
            </Button>
          )}
          {d.isAdmin && (
            <Button
              variant='outline'
              size='sm'
              loading={hiding}
              onClick={() => setHidden({ id: l.id, hidden: !l.is_hidden })}
            >
              <EyeOff />{' '}
              {l.is_hidden ? t('admin.unhideListing') : t('admin.hideListing')}
            </Button>
          )}
        </aside>
      </div>

      {d.similar.length > 0 && (
        <section className='mt-14'>
          <h2 className='mb-5 text-2xl font-extrabold'>
            {t('detail.similar')}
          </h2>
          <ListingGrid listings={d.similar} />
        </section>
      )}

      <ReportDialog
        listingId={l.id}
        open={d.reportOpen}
        onOpenChange={d.setReportOpen}
      />
    </div>
  );
};

const TitleBlock = ({ listing: l }: { listing: Listing }) => {
  const { t } = useTranslation();
  const isAdoption = l.listing_type === 'adoption';
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap gap-1.5'>
        {!isAdoption && (
          <Badge variant={l.listing_type === 'lost' ? 'urgent' : 'default'}>
            {t(`listingType.${l.listing_type}`)}
          </Badge>
        )}
        {isAdoption && l.is_urgent && (
          <Badge variant='urgent'>{t('listing.urgent')}</Badge>
        )}
        <Badge variant='secondary'>
          {categoryEmoji(l.category)} {t(`category.${l.category}`)}
        </Badge>
      </div>
      <h1 className='text-3xl font-extrabold leading-tight sm:text-4xl'>
        {l.title}
      </h1>
      {(l.city || l.address) && (
        <p className='flex items-center gap-1.5 text-muted-foreground'>
          <MapPin className='h-4 w-4' /> {l.address || l.city}
        </p>
      )}
      <p className='text-xs text-muted-foreground'>
        {t('detail.posted', { date: formatDate(l.created_at) })}
      </p>
    </div>
  );
};
