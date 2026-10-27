import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PartyPopper } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Textarea,
} from '_shared';
import { Listing, useMarkAsAdopted, useUpdateStory } from '_entities/listing';

// Mark adopted/reunited (or, if already adopted, edit the success story).
export const AdoptDialog = ({
  listing,
  open,
  onOpenChange,
}: {
  listing: Listing;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [story, setStory] = React.useState(listing.adoption_story ?? '');
  const close = () => onOpenChange(false);
  const { markAsAdopted, isPending: adopting } = useMarkAsAdopted({
    onSuccess: close,
  });
  const { updateStory, isPending: saving } = useUpdateStory({
    onSuccess: close,
  });
  const kind = listing.listing_type === 'adoption' ? 'adopted' : 'reunited';
  const editing = listing.is_adopted;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <PartyPopper className='h-5 w-5 text-terracotta-500' />
            {editing ? t('adopt.editStory') : t(`adopt.title.${kind}`)}
          </DialogTitle>
          <DialogDescription>
            {t(`adopt.description.${kind}`)}
          </DialogDescription>
        </DialogHeader>
        <FormField
          label={t('adopt.story')}
          optional={t('common.optional')}
          hint={t('adopt.storyHint')}
        >
          <Textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder={t('adopt.storyPlaceholder')}
          />
        </FormField>
        <DialogFooter>
          <Button variant='outline' onClick={close}>
            {t('common.cancel')}
          </Button>
          <Button
            loading={adopting || saving}
            onClick={() =>
              editing
                ? updateStory({ id: listing.id, adoption_story: story })
                : markAsAdopted({ id: listing.id, adoption_story: story })
            }
          >
            {editing ? t('common.save') : t(`adopt.confirm.${kind}`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
