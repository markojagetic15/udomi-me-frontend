import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Ban,
  ExternalLink,
  Flag,
  History,
  LayoutGrid,
  Mail,
  Trash2,
} from 'lucide-react';
import { useAdminUserDetail, useSetUserBanned } from '_entities/admin';
import { firstImage } from '_entities/listing';
import { UserAvatar } from '_entities/user';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '_shared';
import { DeleteUserDialog, ListingStatusBadge, UserBadges } from './parts';
import { MessageUserDialog } from './MessageUserDialog';
import { ActionRow } from './ActivityTab';

export const UserSheet = ({
  userId,
  onClose,
  onOpenListing,
  selfId,
}: {
  userId: string | null;
  onClose: () => void;
  onOpenListing: (id: string) => void;
  selfId?: string;
}) => {
  const { t } = useTranslation();
  // Stop querying something we just deleted (a refetch would only 404).
  const [deletedId, setDeletedId] = React.useState<string | null>(null);
  const { getUserDetail } = useAdminUserDetail(
    userId === deletedId ? null : userId
  );
  const ban = useSetUserBanned();
  const [deleting, setDeleting] = React.useState(false);
  const d = getUserDetail.data;
  const u = d?.user;
  const protectedAccount = !!u && (u.role === 'admin' || u.id === selfId);

  return (
    <Sheet open={!!userId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side='right'
        className='w-full overflow-y-auto sm:max-w-2xl'
      >
        {!u ? (
          <div className='flex flex-1 items-center justify-center'>
            {getUserDetail.isError ? (
              <p>{t('errors.notFound')}</p>
            ) : (
              <Spinner />
            )}
            <SheetTitle className='sr-only'>{t('admin.tabUsers')}</SheetTitle>
          </div>
        ) : (
          <>
            <SheetHeader>
              <div className='flex items-center gap-3'>
                <UserAvatar
                  name={`${u.first_name} ${u.last_name}`}
                  url={u.avatar_url}
                  className='h-14 w-14'
                />
                <div className='min-w-0'>
                  <SheetTitle className='truncate'>
                    {u.first_name} {u.last_name}
                  </SheetTitle>
                  <SheetDescription className='flex items-center gap-1.5 truncate'>
                    <Mail className='h-3.5 w-3.5 shrink-0' /> {u.email}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className='flex flex-wrap items-center gap-2'>
              <UserBadges u={u} />
            </div>
            <dl className='grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-muted/60 p-4 text-sm'>
              <dt className='text-muted-foreground'>{t('admin.joined')}</dt>
              <dd>{formatDate(u.created_at)}</dd>
              <dt className='text-muted-foreground'>{t('admin.language')}</dt>
              <dd className='uppercase'>{u.language}</dd>
              {u.shelter_name && (
                <>
                  <dt className='text-muted-foreground'>{t('shelter.name')}</dt>
                  <dd>
                    {u.shelter_name} {u.shelter_city && `· ${u.shelter_city}`}
                  </dd>
                </>
              )}
              <dt className='text-muted-foreground'>ID</dt>
              <dd className='truncate font-mono text-xs'>{u.id}</dd>
            </dl>

            <div className='flex flex-wrap gap-2'>
              <Button variant='outline' size='sm' asChild>
                <Link to={`/users/${u.id}`} target='_blank'>
                  <ExternalLink /> {t('nav.publicProfile')}
                </Link>
              </Button>
              {u.id !== selfId && <MessageUserDialog user={u} />}
              {!protectedAccount && (
                <>
                  <Button
                    variant={u.is_banned ? 'outline' : 'secondary'}
                    size='sm'
                    loading={ban.isPending}
                    onClick={() => ban.run({ id: u.id, banned: !u.is_banned })}
                  >
                    <Ban /> {u.is_banned ? t('admin.unban') : t('admin.ban')}
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => setDeleting(true)}
                  >
                    <Trash2 /> {t('admin.deleteUser')}
                  </Button>
                </>
              )}
            </div>
            {protectedAccount && (
              <p className='text-xs text-muted-foreground'>
                {t('admin.protectedAccount')}
              </p>
            )}

            <Tabs defaultValue='pets'>
              <TabsList className='w-full justify-start'>
                <TabsTrigger value='pets'>
                  <LayoutGrid /> {t('admin.userPets')} ({d.listings.length})
                </TabsTrigger>
                <TabsTrigger value='against'>
                  <Flag /> {t('admin.reportsAgainst')} (
                  {d.reports_against.length})
                </TabsTrigger>
                <TabsTrigger value='filed'>
                  {t('admin.reportsFiled')} ({d.reports_filed.length})
                </TabsTrigger>
                <TabsTrigger value='history'>
                  <History /> {t('admin.history')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value='pets' className='mt-4 flex flex-col gap-2'>
                {d.listings.length === 0 ? (
                  <EmptyState title={t('admin.noPets')} className='py-8' />
                ) : (
                  d.listings.map((l) => (
                    <button
                      key={l.id}
                      type='button'
                      onClick={() => onOpenListing(l.id)}
                      className='flex items-center gap-3 rounded-lg border bg-card p-2.5 text-left transition hover:bg-secondary/60'
                    >
                      {firstImage(l) ? (
                        <img
                          src={firstImage(l)!}
                          alt=''
                          className='h-12 w-12 shrink-0 rounded-md object-cover'
                        />
                      ) : (
                        <div className='h-12 w-12 shrink-0 rounded-md bg-muted' />
                      )}
                      <span className='min-w-0 flex-1'>
                        <span className='block truncate font-medium'>
                          {l.title}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {t(`listingType.${l.listing_type}`)} ·{' '}
                          {formatDate(l.created_at)}
                        </span>
                      </span>
                      <ListingStatusBadge l={l} />
                    </button>
                  ))
                )}
              </TabsContent>

              <TabsContent value='against' className='mt-4 flex flex-col gap-2'>
                {d.reports_against.length === 0 ? (
                  <EmptyState title={t('admin.noReports')} className='py-8' />
                ) : (
                  d.reports_against.map((r) => (
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
                      {r.listing && (
                        <button
                          type='button'
                          className='mt-1.5 font-medium hover:underline'
                          onClick={() => onOpenListing(r.listing!.id)}
                        >
                          {r.listing.title}
                        </button>
                      )}
                      <p className='text-xs text-muted-foreground'>
                        {t('admin.reporter')}:{' '}
                        {r.reporter?.email ?? t('admin.deletedUser')}
                      </p>
                      {r.details && (
                        <p className='mt-2 rounded bg-muted p-2'>
                          “{r.details}”
                        </p>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value='filed' className='mt-4 flex flex-col gap-2'>
                {d.reports_filed.length === 0 ? (
                  <EmptyState title={t('admin.noReports')} className='py-8' />
                ) : (
                  d.reports_filed.map((r) => (
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
                      {r.listing ? (
                        <button
                          type='button'
                          className='mt-1.5 font-medium hover:underline'
                          onClick={() => onOpenListing(r.listing!.id)}
                        >
                          {r.listing.title}
                        </button>
                      ) : (
                        <p className='mt-1.5 text-muted-foreground'>
                          {t('messages.listingRemoved')}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value='history' className='mt-4'>
                {d.history.length === 0 ? (
                  <EmptyState title={t('admin.noHistory')} className='py-8' />
                ) : (
                  <div className='divide-y rounded-lg border bg-card'>
                    {d.history.map((a) => (
                      <ActionRow key={a.id} a={a} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DeleteUserDialog
              user={u}
              open={deleting}
              onOpenChange={setDeleting}
              onDeleted={() => {
                setDeletedId(u.id);
                onClose();
              }}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
