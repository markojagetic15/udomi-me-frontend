import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BellPlus } from 'lucide-react';
import { useGlobalContext } from '_app';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  toast,
} from '_shared';
import { ListingType } from '_entities/listing';
import { useCreateSavedSearch } from '_entities/notification';
import { BrowseFilters, toApiFilters } from '../model';

const defaultName = (f: BrowseFilters, t: (k: string) => string) =>
  [f.categories.map((c) => t(`category.${c}`)).join(', '), f.city, f.q]
    .filter(Boolean)
    .join(' · ') || t('savedSearch.defaultName');

// "Notify me about new listings like these" — stores the current filters.
export const SaveSearchButton = ({
  filters,
  type,
}: {
  filters: BrowseFilters;
  type: ListingType;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useGlobalContext();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const { createSavedSearch, isPending } = useCreateSavedSearch({
    onSuccess: () => setOpen(false),
  });

  return (
    <>
      <Button
        variant='outline'
        className='h-11'
        onClick={() => {
          if (!isLoggedIn) {
            toast(t('savedSearch.loginFirst'));
            navigate(
              `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`
            );
            return;
          }
          setName(defaultName(filters, t));
          setOpen(true);
        }}
      >
        <BellPlus />
        <span className='hidden sm:inline'>{t('savedSearch.save')}</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('savedSearch.title')}</DialogTitle>
            <DialogDescription>
              {t('savedSearch.description')}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim())
                createSavedSearch({
                  name: name.trim(),
                  filters: toApiFilters(filters, type),
                });
            }}
            className='flex flex-col gap-4'
          >
            <FormField label={t('savedSearch.name')}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                autoFocus
              />
            </FormField>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type='submit' loading={isPending} disabled={!name.trim()}>
                {t('savedSearch.confirm')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
