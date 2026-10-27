import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, Clock, XCircle } from 'lucide-react';
import { Button, FormField, Input, Textarea } from '_shared';
import {
  Me,
  ShelterInput,
  useApplyShelter,
  useWithdrawShelter,
} from '_entities/user';

const schema = (t: (k: string) => string) =>
  yup.object({
    shelter_name: yup
      .string()
      .trim()
      .required(t('validation.required'))
      .min(2)
      .max(100),
    shelter_city: yup
      .string()
      .trim()
      .required(t('validation.required'))
      .min(2)
      .max(80),
    shelter_description: yup
      .string()
      .trim()
      .required(t('validation.required'))
      .min(20, t('shelter.descriptionMin'))
      .max(2000),
    shelter_website: yup
      .string()
      .trim()
      .url(t('validation.urlInvalid'))
      .optional(),
    shelter_phone: yup.string().trim().max(30).optional(),
  });

const Status = ({ status }: { status: Me['shelter_status'] }) => {
  const { t } = useTranslation();
  if (status === 'verified')
    return (
      <p className='flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm font-medium text-primary'>
        <BadgeCheck className='h-5 w-5' /> {t('shelter.statusVerified')}
      </p>
    );
  if (status === 'pending')
    return (
      <p className='flex items-center gap-2 rounded-lg bg-terracotta-50 p-3 text-sm font-medium text-terracotta-700'>
        <Clock className='h-5 w-5' /> {t('shelter.statusPending')}
      </p>
    );
  if (status === 'rejected')
    return (
      <p className='flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive'>
        <XCircle className='h-5 w-5' /> {t('shelter.statusRejected')}
      </p>
    );
  return null;
};

export const ShelterApplicationForm = ({ me }: { me: Me }) => {
  const { t } = useTranslation();
  const { applyShelter, isPending } = useApplyShelter();
  const { withdrawShelter, isPending: withdrawing } = useWithdrawShelter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShelterInput>({
    resolver: yupResolver(schema(t)) as never,
    defaultValues: {
      shelter_name: me.shelter_name ?? '',
      shelter_city: me.shelter_city ?? '',
      shelter_description: me.shelter_description ?? '',
      shelter_website: me.shelter_website ?? '',
      shelter_phone: me.shelter_phone ?? '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) =>
        applyShelter({
          ...v,
          shelter_website: v.shelter_website || undefined,
          shelter_phone: v.shelter_phone || undefined,
        })
      )}
      className='flex flex-col gap-4'
    >
      <Status status={me.shelter_status} />
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormField
          label={t('shelter.name')}
          error={errors.shelter_name?.message}
          required
        >
          <Input {...register('shelter_name')} />
        </FormField>
        <FormField
          label={t('shelter.city')}
          error={errors.shelter_city?.message}
          required
        >
          <Input {...register('shelter_city')} />
        </FormField>
        <FormField
          label={t('shelter.website')}
          optional={t('common.optional')}
          error={errors.shelter_website?.message}
        >
          <Input
            {...register('shelter_website')}
            type='url'
            placeholder='https://'
          />
        </FormField>
        <FormField
          label={t('shelter.phone')}
          optional={t('common.optional')}
          error={errors.shelter_phone?.message}
        >
          <Input {...register('shelter_phone')} type='tel' />
        </FormField>
      </div>
      <FormField
        label={t('shelter.description')}
        error={errors.shelter_description?.message}
        required
        hint={t('shelter.descriptionHint')}
      >
        <Textarea
          {...register('shelter_description')}
          rows={4}
          maxLength={2000}
        />
      </FormField>
      <div className='flex flex-wrap gap-2'>
        <Button type='submit' loading={isPending}>
          {me.account_type === 'shelter'
            ? t('shelter.update')
            : t('shelter.apply')}
        </Button>
        {me.account_type === 'shelter' && (
          <Button
            type='button'
            variant='ghost'
            loading={withdrawing}
            onClick={() => withdrawShelter()}
          >
            {t('shelter.withdraw')}
          </Button>
        )}
      </div>
    </form>
  );
};
