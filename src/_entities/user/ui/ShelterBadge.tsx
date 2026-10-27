import { BadgeCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, cn } from '_shared';

export const ShelterBadge = ({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Badge
      variant='secondary'
      className={cn('gap-1 text-primary', className)}
      title={t('shelter.verifiedHint')}
    >
      <BadgeCheck className='!size-3.5' />
      {!compact && t('shelter.verified')}
    </Badge>
  );
};
