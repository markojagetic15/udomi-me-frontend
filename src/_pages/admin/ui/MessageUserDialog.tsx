import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import { AdminUser, useAdminMessageUser } from '_entities/admin';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '_shared';

// Direct message to one user, from "Udomi me tim". Lands in their inbox;
// replies come back to the admin's Messages.
export const MessageUserDialog = ({ user }: { user: AdminUser }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [body, setBody] = React.useState('');
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const { messageUser, isPending } = useAdminMessageUser((cid) => {
    setBody('');
    setSentTo(cid);
  });

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        disabled={user.is_banned}
        onClick={() => {
          setSentTo(null);
          setOpen(true);
        }}
      >
        <MessageCircle /> {t('admin.sendMessage')}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('admin.messageTitle', { name: user.first_name })}
            </DialogTitle>
            <DialogDescription>{t('admin.messageHint')}</DialogDescription>
          </DialogHeader>
          {sentTo ? (
            <DialogFooter>
              <Button variant='outline' onClick={() => setOpen(false)}>
                {t('common.close')}
              </Button>
              <Button onClick={() => navigate(`/messages/${sentTo}`)}>
                {t('admin.openConversation')}
              </Button>
            </DialogFooter>
          ) : (
            <>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                maxLength={2000}
                autoFocus
                placeholder={t('messages.placeholder')}
              />
              <DialogFooter>
                <Button variant='outline' onClick={() => setOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button
                  loading={isPending}
                  disabled={!body.trim()}
                  onClick={() =>
                    messageUser({ id: user.id, body: body.trim() })
                  }
                >
                  {t('messages.send')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
