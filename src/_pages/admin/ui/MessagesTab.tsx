import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Send } from 'lucide-react';
import {
  BroadcastAudience,
  useBroadcast,
  useBroadcastCount,
} from '_entities/admin';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  RadioCard,
  RadioGroup,
  Textarea,
} from '_shared';

const AUDIENCES: BroadcastAudience[] = ['all', 'posters', 'shelters'];

// One message to many users, delivered as a direct message from
// "Udomi me tim" into each user's inbox (in-app only, no email copies).
export const MessagesTab = () => {
  const { t } = useTranslation();
  const [audience, setAudience] = React.useState<BroadcastAudience>('all');
  const [body, setBody] = React.useState('');
  const [confirming, setConfirming] = React.useState(false);
  const { recipients } = useBroadcastCount(audience);
  const { broadcast, isPending } = useBroadcast(() => {
    setConfirming(false);
    setBody('');
  });

  return (
    <div className='grid gap-5 lg:grid-cols-[1fr_320px]'>
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.broadcastTitle')}</CardTitle>
          <CardDescription>{t('admin.broadcastHint')}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-5'>
          <RadioGroup
            value={audience}
            onValueChange={(v) => setAudience(v as BroadcastAudience)}
            className='grid-cols-1 sm:grid-cols-3'
          >
            {AUDIENCES.map((a) => (
              <RadioCard
                key={a}
                value={a}
                className='flex-col items-start gap-0.5'
              >
                <span className='font-semibold'>
                  {t(`admin.audience.${a}`)}
                </span>
                <span className='text-xs text-muted-foreground'>
                  {t(`admin.audienceHint.${a}`)}
                </span>
              </RadioCard>
            ))}
          </RadioGroup>
          <FormField
            label={t('admin.broadcastMessage')}
            hint={<span className='tabular-nums'>{body.length}/2000</span>}
          >
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              maxLength={2000}
              placeholder={t('admin.broadcastPlaceholder')}
            />
          </FormField>
          <div className='flex flex-wrap items-center gap-3'>
            <Button
              disabled={!body.trim() || !recipients}
              onClick={() => setConfirming(true)}
            >
              <Send /> {t('admin.broadcastSend')}
            </Button>
            <span className='text-sm text-muted-foreground'>
              {recipients === undefined
                ? '…'
                : t('admin.recipients', { count: recipients })}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className='h-fit bg-sage-50'>
        <CardContent className='flex gap-3 p-5 text-sm text-muted-foreground'>
          <Info className='mt-0.5 h-5 w-5 shrink-0 text-primary' />
          <div className='flex flex-col gap-2'>
            <p>{t('admin.broadcastInfo1')}</p>
            <p>{t('admin.broadcastInfo2')}</p>
            <p>{t('admin.broadcastInfo3')}</p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('admin.broadcastConfirmTitle', { count: recipients ?? 0 })}
            </AlertDialogTitle>
            <AlertDialogDescription className='whitespace-pre-line rounded-lg bg-muted p-3 text-foreground'>
              {body.trim()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <Button
              loading={isPending}
              onClick={() => broadcast({ audience, body: body.trim() })}
            >
              <Send /> {t('admin.broadcastSend')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
