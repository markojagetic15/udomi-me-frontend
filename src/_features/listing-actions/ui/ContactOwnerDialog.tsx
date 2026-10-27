import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useGlobalContext } from '_app';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
  toast,
} from '_shared';
import { Listing } from '_entities/listing';
import { useStartConversation } from '_entities/messaging';

// Opens (or continues) the in-app thread with the listing owner.
export const ContactOwnerButton = ({
  listing,
  ownerName,
  className,
}: {
  listing: Listing;
  ownerName: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useGlobalContext();
  const [open, setOpen] = React.useState(false);
  const [body, setBody] = React.useState('');
  const { startConversation, isPending } = useStartConversation({
    onSuccess: (id) => navigate(`/messages/${id}`),
  });

  const openDialog = () => {
    if (!isLoggedIn) {
      toast(t('contact.loginFirst'));
      navigate(`/login?next=${encodeURIComponent(`/animal/${listing.id}`)}`);
      return;
    }
    setBody(
      t(`contact.template.${listing.listing_type}`, { title: listing.title })
    );
    setOpen(true);
  };

  return (
    <>
      <Button size='lg' className={className} onClick={openDialog}>
        <MessageCircle /> {t('contact.button', { name: ownerName })}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('contact.title', { name: ownerName })}</DialogTitle>
            <DialogDescription>{t('contact.description')}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            maxLength={2000}
            autoFocus
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              loading={isPending}
              disabled={!body.trim()}
              onClick={() =>
                startConversation({ listing_id: listing.id, body: body.trim() })
              }
            >
              {t('contact.send')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
