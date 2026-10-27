import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Flag } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  RadioCard,
  RadioGroup,
  Textarea,
} from '_shared';
import {
  REPORT_REASONS,
  ReportReason,
  useReportListing,
} from '_entities/listing';

export const ReportDialog = ({
  listingId,
  open,
  onOpenChange,
}: {
  listingId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = React.useState<ReportReason | ''>('');
  const [details, setDetails] = React.useState('');
  const { reportListing, isPending } = useReportListing({
    onSuccess: () => {
      onOpenChange(false);
      setReason('');
      setDetails('');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Flag className='h-5 w-5 text-destructive' /> {t('report.title')}
          </DialogTitle>
          <DialogDescription>{t('report.description')}</DialogDescription>
        </DialogHeader>
        <form
          className='flex flex-col gap-4'
          onSubmit={(e) => {
            e.preventDefault();
            if (reason)
              reportListing({
                id: listingId,
                reason,
                details: details.trim() || undefined,
              });
          }}
        >
          <RadioGroup
            value={reason}
            onValueChange={(v) => setReason(v as ReportReason)}
          >
            {REPORT_REASONS.map((r) => (
              <RadioCard key={r} value={r} className='py-2.5'>
                {t(`report.reason.${r}`)}
              </RadioCard>
            ))}
          </RadioGroup>
          <FormField
            label={t('report.details')}
            optional={t('common.optional')}
          >
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </FormField>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type='submit'
              variant='destructive'
              loading={isPending}
              disabled={!reason}
            >
              {t('report.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
