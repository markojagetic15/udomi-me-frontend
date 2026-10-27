import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Pause,
  PartyPopper,
  Pencil,
  Play,
  Trash2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '_shared';
import {
  Listing,
  useDeleteListing,
  useSetListingActive,
} from '_entities/listing';
import { AdoptDialog } from './AdoptDialog';

// Edit + overflow menu (pause/resume, mark adopted, delete) for the owner.
export const OwnerActions = ({
  listing,
  afterDelete,
}: {
  listing: Listing;
  afterDelete?: () => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [adoptOpen, setAdoptOpen] = React.useState(false);
  const { deleteListing, isPending: deleting } = useDeleteListing({
    onSuccess: afterDelete,
  });
  const { setListingActive } = useSetListingActive();
  const kind = listing.listing_type === 'adoption' ? 'adopted' : 'reunited';

  return (
    <div className='flex gap-2'>
      <Button onClick={() => navigate(`/edit-listing/${listing.id}`)}>
        <Pencil /> {t('listing.edit')}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' aria-label={t('common.more')}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {listing.is_adopted ? (
            <DropdownMenuItem onSelect={() => setAdoptOpen(true)}>
              <PartyPopper /> {t('adopt.editStory')}
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem onSelect={() => setAdoptOpen(true)}>
                <PartyPopper /> {t(`adopt.menu.${kind}`)}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  setListingActive({
                    id: listing.id,
                    active: listing.is_active === false,
                  })
                }
              >
                {listing.is_active === false ? <Play /> : <Pause />}
                {listing.is_active === false
                  ? t('listing.resume')
                  : t('listing.pause')}
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => setConfirmDelete(true)}>
            <Trash2 /> {t('listing.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AdoptDialog
        listing={listing}
        open={adoptOpen}
        onOpenChange={setAdoptOpen}
      />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('listing.deleteConfirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('listing.deleteConfirmText')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              destructive
              disabled={deleting}
              onClick={() => deleteListing(listing.id)}
            >
              {t('listing.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
