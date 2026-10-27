import { useTranslation } from 'react-i18next';
import { BadgeCheck, Check, X } from 'lucide-react';
import { Button, Card, EmptyState, Spinner } from '_shared';
import { useSheltersTab } from '../hooks';

export const SheltersTab = ({
  onOpenUser,
}: {
  onOpenUser: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const p = useSheltersTab();
  if (p.isLoading) return <Spinner />;
  if (!p.shelters.length)
    return <EmptyState icon={<BadgeCheck />} title={t('admin.noShelters')} />;
  return (
    <div className='grid gap-3 lg:grid-cols-2'>
      {p.shelters.map((s) => (
        <Card key={s.id} className='flex flex-col gap-3 p-5'>
          <div>
            <p className='font-display text-lg font-bold'>{s.shelter_name}</p>
            <button
              type='button'
              className='text-left text-sm text-muted-foreground hover:underline'
              onClick={() => onOpenUser(s.id)}
            >
              {s.shelter_city} · {s.first_name} {s.last_name} ({s.email})
            </button>
          </div>
          <p className='whitespace-pre-line text-sm'>{s.shelter_description}</p>
          <div className='flex flex-wrap gap-3 text-sm'>
            {s.shelter_website && (
              <a
                href={s.shelter_website}
                target='_blank'
                rel='noopener noreferrer nofollow'
                className='text-primary hover:underline'
              >
                {s.shelter_website}
              </a>
            )}
            {s.shelter_phone && <span>{s.shelter_phone}</span>}
          </div>
          <div className='flex gap-2'>
            <Button
              size='sm'
              disabled={p.reviewing}
              onClick={() => p.reviewShelter({ id: s.id, approve: true })}
            >
              <Check /> {t('admin.approve')}
            </Button>
            <Button
              size='sm'
              variant='outline'
              disabled={p.reviewing}
              onClick={() => p.reviewShelter({ id: s.id, approve: false })}
            >
              <X /> {t('admin.reject')}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
