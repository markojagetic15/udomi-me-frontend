import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ExternalLink,
  EyeOff,
  Eye,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { useAdminListingDetail, useSetListingHidden } from '_entities/admin';
import { categoryEmoji, firstImage } from '_entities/listing';
import {
  Badge,
  Button,
  EmptyState,
  formatDate,
  formatDateTime,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Spinner,
} from '_shared';
import { DeleteListingDialog, ListingStatusBadge } from './parts';
import { ActionRow } from './ActivityTab';

export const ListingSheet = ({
  listingId,
  onClose,
  onOpenUser,
}: {
  listingId: string | null;
  onClose: () => void;
  onOpenUser: (id: string) => void;
}) => {
  const { t } = useTranslation();
  // Stop querying something we just deleted (a refetch would only 404).
  const [deletedId, setDeletedId] = React.useState<string | null>(null);
  const { getListingDetail } = useAdminListingDetail(
    listingId === deletedId ? null : listingId
  );
  const hide = useSetListingHidden();
  const [deleting, setDeleting] = React.useState(false);
  const d = getListingDetail.data;
  const l = d?.listing;

  return (
    <Sheet open={!!listingId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side='right'
        className='w-full overflow-y-auto sm:max-w-2xl'
      >
        {!l ? (
          <div className='flex flex-1 items-center justify-center'>
            {getListingDetail.isError ? (
              <p>{t('errors.notFound')}</p>
            ) : (
              <Spinner />
            )}
            <SheetTitle className='sr-only'>{t('admin.tabPets')}</SheetTitle>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>
                {categoryEmoji(l.category)} {l.title}
              </SheetTitle>
              <SheetDescription>
                {t(`listingType.${l.listing_type}`)} · {l.city || l.address} ·{' '}
                {formatDate(l.created_at)}
              </SheetDescription>
            </SheetHeader>

            <div className='flex flex-wrap items-center gap-2'>
              <ListingStatusBadge l={l} />
              {l.is_urgent && (
                <Badge variant='urgent'>{t('listing.urgent')}</Badge>
              )}
            </div>

            {l.images.length > 0 && (
              <div className='flex gap-2 overflow-x-auto'>
                {[...l.images]
                  .sort((a, b) => a.position - b.position)
                  .map((img) => (
                    <a
                      key={img.id}
                      href={img.url}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <img
                        src={img.url}
                        alt=''
                        className='h-24 w-24 shrink-0 rounded-lg object-cover'
                      />
                    </a>
                  ))}
              </div>
            )}
            {!firstImage(l) && (
              <p className='text-sm text-muted-foreground'>
                {t('admin.noPhotos')}
              </p>
            )}

            <p className='whitespace-pre-line rounded-lg bg-muted/60 p-4 text-sm'>
              {l.description}
            </p>

            {l.user && (
              <button
                type='button'
                onClick={() => onOpenUser(l.user!.id)}
                className='flex items-center gap-2 rounded-lg border bg-card p-3 text-left text-sm transition hover:bg-secondary/60'
              >
                <UserIcon className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>
                  {l.user.first_name} {l.user.last_name}
                </span>
                <span className='truncate text-muted-foreground'>
                  {l.user.email}
                </span>
              </button>
            )}

            <div className='flex flex-wrap gap-2'>
              <Button variant='outline' size='sm' asChild>
                <Link to={`/animal/${l.id}`} target='_blank'>
                  <ExternalLink /> {t('admin.viewPublic')}
                </Link>
              </Button>
              <Button
                variant='secondary'
                size='sm'
                loading={hide.isPending}
                onClick={() => hide.run({ id: l.id, hidden: !l.is_hidden })}
              >
                {l.is_hidden ? <Eye /> : <EyeOff />}
                {l.is_hidden
                  ? t('admin.unhideListing')
                  : t('admin.hideListing')}
              </Button>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => setDeleting(true)}
              >
                <Trash2 /> {t('admin.deleteListing')}
              </Button>
            </div>

            <section>
              <h3 className='mb-2 font-display font-bold'>
                {t('admin.tabReports')} ({d.reports.length})
              </h3>
              {d.reports.length === 0 ? (
                <EmptyState title={t('admin.noReports')} className='py-8' />
              ) : (
                <div className='flex flex-col gap-2'>
                  {d.reports.map((r) => (
                    <div
                      key={r.id}
                      className='rounded-lg border bg-card p-3 text-sm'
                    >
                      <div className='flex flex-wrap items-center gap-2'>
                        <Badge variant='destructive'>
                          {t(`report.reason.${r.reason}`)}
                        </Badge>
                        <Badge variant='outline'>
                          {t(`admin.reportStatus.${r.status}`)}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {formatDateTime(r.created_at)}
                        </span>
                      </div>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {t('admin.reporter')}:{' '}
                        {r.reporter ? (
                          <button
                            type='button'
                            className='hover:underline'
                            onClick={() => onOpenUser(r.reporter!.id)}
                          >
                            {r.reporter.email}
                          </button>
                        ) : (
                          t('admin.deletedUser')
                        )}
                      </p>
                      {r.details && (
                        <p className='mt-2 rounded bg-muted p-2'>
                          “{r.details}”
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {d.history.length > 0 && (
              <section>
                <h3 className='mb-2 font-display font-bold'>
                  {t('admin.history')}
                </h3>
                <div className='divide-y rounded-lg border bg-card'>
                  {d.history.map((a) => (
                    <ActionRow key={a.id} a={a} />
                  ))}
                </div>
              </section>
            )}

            <DeleteListingDialog
              listing={l}
              open={deleting}
              onOpenChange={setDeleting}
              onDeleted={() => {
                setDeletedId(l.id);
                onClose();
              }}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
