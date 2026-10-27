import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import {
  AdminListing,
  AdminUser,
  useAdminDeleteListing,
  useAdminDeleteUser,
} from '_entities/admin';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  cn,
  Input,
} from '_shared';

export const FilterChips = <T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: (v: T) => string;
}) => (
  <div className='flex flex-wrap gap-2'>
    {options.map((o) => (
      <button
        key={o}
        type='button'
        onClick={() => onChange(o)}
        aria-pressed={value === o}
        className={cn(
          'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
          value === o
            ? 'border-primary bg-primary text-primary-foreground'
            : 'bg-card hover:bg-secondary'
        )}
      >
        {label(o)}
      </button>
    ))}
  </div>
);

export const UserBadges = ({ u }: { u: AdminUser }) => {
  const { t } = useTranslation();
  return (
    <span className='flex flex-wrap gap-1'>
      {u.role === 'admin' && <Badge>{t('admin.roleAdmin')}</Badge>}
      {u.shelter_status === 'verified' && (
        <Badge variant='secondary'>{t('shelter.verified')}</Badge>
      )}
      {u.account_type === 'shelter' && u.shelter_status === 'pending' && (
        <Badge variant='warm'>{t('admin.shelterPending')}</Badge>
      )}
      {!u.is_verified && (
        <Badge variant='outline'>{t('admin.unverified')}</Badge>
      )}
      {u.is_banned && <Badge variant='destructive'>{t('admin.banned')}</Badge>}
      {!u.has_password && <Badge variant='outline'>Google</Badge>}
    </span>
  );
};

type ListingLike = Pick<
  AdminListing,
  'is_hidden' | 'is_adopted' | 'is_active' | 'listing_type'
>;

export const ListingStatusBadge = ({ l }: { l: ListingLike }) => {
  const { t } = useTranslation();
  if (l.is_hidden)
    return <Badge variant='destructive'>{t('listing.hiddenByAdmin')}</Badge>;
  if (l.is_adopted)
    return (
      <Badge variant='success'>
        {l.listing_type === 'adoption'
          ? t('listing.adopted')
          : t('listing.reunited')}
      </Badge>
    );
  if (l.is_active === false)
    return <Badge variant='outline'>{t('listing.paused')}</Badge>;
  return <Badge variant='secondary'>{t('admin.statusActive')}</Badge>;
};

// Permanent deletion: the admin must type the user's email to enable it.
export const DeleteUserDialog = ({
  user,
  open,
  onOpenChange,
  onDeleted,
}: {
  user: AdminUser;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDeleted: () => void;
}) => {
  const { t } = useTranslation();
  const [typed, setTyped] = React.useState('');
  const { run, isPending } = useAdminDeleteUser(() => {
    onOpenChange(false);
    onDeleted();
  });
  const matches = typed.trim().toLowerCase() === user.email.toLowerCase();
  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        setTyped('');
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.deleteUserTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.deleteUserText', { email: user.email })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={user.email}
          aria-label={t('admin.typeEmail')}
          autoComplete='off'
        />
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <Button
            variant='destructive'
            disabled={!matches}
            loading={isPending}
            onClick={() => run({ id: user.id, confirm_email: typed.trim() })}
          >
            <Trash2 /> {t('admin.deleteUser')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const DeleteListingDialog = ({
  listing,
  open,
  onOpenChange,
  onDeleted,
}: {
  listing: { id: string; title: string };
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDeleted?: () => void;
}) => {
  const { t } = useTranslation();
  const { run, isPending } = useAdminDeleteListing(() => {
    onOpenChange(false);
    onDeleted?.();
  });
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.deleteListingTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.deleteListingText', { title: listing.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <Button
            variant='destructive'
            loading={isPending}
            onClick={() => run(listing.id)}
          >
            <Trash2 /> {t('admin.deleteListing')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
