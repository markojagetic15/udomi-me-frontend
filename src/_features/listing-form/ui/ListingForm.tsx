import * as React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HeartHandshake, Search, SearchCheck } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  DateInput,
  FormField,
  Input,
  Label,
  LocationPicker,
  RadioCard,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  cn,
} from '_shared';
import { CATEGORIES, ListingType } from '_entities/listing';
import { ListingFormValues } from '../model';
import { ImageUploader } from './ImageUploader';

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className='flex flex-col gap-5'>{children}</CardContent>
  </Card>
);

const TYPE_OPTIONS: { type: ListingType; icon: React.ReactNode }[] = [
  { type: 'adoption', icon: <HeartHandshake className='h-6 w-6' /> },
  { type: 'lost', icon: <Search className='h-6 w-6' /> },
  { type: 'found', icon: <SearchCheck className='h-6 w-6' /> },
];

const TRAITS = [
  ['is_vaccinated', 'traits.vaccinated'],
  ['is_sterilized', 'traits.sterilized'],
  ['is_microchipped', 'traits.microchipped'],
] as const;

const TEMPERAMENT = [
  ['good_with_kids', 'traits.goodWithKids'],
  ['good_with_dogs', 'traits.goodWithDogs'],
  ['good_with_cats', 'traits.goodWithCats'],
] as const;

export const ListingForm = ({
  form,
  submit,
  mode,
  isPending,
  onCancel,
}: {
  form: UseFormReturn<ListingFormValues>;
  submit: (e?: React.BaseSyntheticEvent) => void;
  mode: 'create' | 'edit';
  isPending: boolean;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;
  const type = watch('listing_type');
  const isAdoption = type === 'adoption';
  const feeMode = watch('fee_mode');
  const description = watch('description') ?? '';

  return (
    <form onSubmit={submit} noValidate className='flex flex-col gap-5'>
      {mode === 'create' && (
        <Section title={t('listingForm.typeTitle')}>
          <Controller
            control={control}
            name='listing_type'
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className='grid-cols-1 sm:grid-cols-3'
              >
                {TYPE_OPTIONS.map((o) => (
                  <RadioCard
                    key={o.type}
                    value={o.type}
                    className='flex-col items-start gap-2 p-4'
                  >
                    <span className='text-primary'>{o.icon}</span>
                    <span className='font-semibold'>
                      {t(`listingForm.type.${o.type}`)}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {t(`listingForm.typeHint.${o.type}`)}
                    </span>
                  </RadioCard>
                ))}
              </RadioGroup>
            )}
          />
        </Section>
      )}

      <Section
        title={t('listingForm.photos')}
        description={t('listingForm.photosHint')}
      >
        <Controller
          control={control}
          name='images'
          render={({ field }) => (
            <ImageUploader
              value={field.value}
              onChange={(imgs) => field.onChange(imgs)}
              error={errors.images?.message}
            />
          )}
        />
      </Section>

      <Section title={t('listingForm.basics')}>
        <FormField
          label={t('listingForm.title')}
          error={errors.title?.message}
          required
          hint={t(`listingForm.titleHint.${type}`)}
        >
          <Input
            {...register('title')}
            maxLength={60}
            placeholder={t(`listingForm.titlePlaceholder.${type}`)}
          />
        </FormField>

        <div className='grid gap-5 sm:grid-cols-2'>
          <FormField
            label={t('listingForm.category')}
            error={errors.category?.message}
            required
          >
            {(ctl) => (
              <Controller
                control={control}
                name='category'
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger onBlur={field.onBlur} {...ctl}>
                      <SelectValue placeholder={t('common.choose')} />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.emoji} {t(`category.${c.key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>

          <FormField
            label={t('listingForm.gender')}
            error={errors.gender?.message}
            required
          >
            {(ctl) => (
              <Controller
                control={control}
                name='gender'
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger onBlur={field.onBlur} {...ctl}>
                      <SelectValue placeholder={t('common.choose')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='male'>{t('gender.male')}</SelectItem>
                      <SelectItem value='female'>
                        {t('gender.female')}
                      </SelectItem>
                      {!isAdoption && (
                        <SelectItem value='unknown'>
                          {t('gender.unknown')}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>

          {!isAdoption && (
            <FormField
              label={t(`listingForm.eventDate.${type}`)}
              error={errors.event_date?.message}
              required
            >
              {(ctl) => (
                <Controller
                  control={control}
                  name='event_date'
                  render={({ field }) => (
                    <DateInput
                      {...ctl}
                      value={field.value}
                      onChange={field.onChange}
                      toDate={new Date()}
                      fromYear={2015}
                    />
                  )}
                />
              )}
            </FormField>
          )}

          <FormField
            label={t('listingForm.dateOfBirth')}
            error={errors.date_of_birth?.message}
            required={isAdoption}
            optional={isAdoption ? undefined : t('common.optional')}
            hint={t('listingForm.dateOfBirthHint')}
          >
            {(ctl) => (
              <Controller
                control={control}
                name='date_of_birth'
                render={({ field }) => (
                  <DateInput
                    {...ctl}
                    value={field.value}
                    onChange={field.onChange}
                    toDate={new Date()}
                    fromYear={1995}
                  />
                )}
              />
            )}
          </FormField>

          <FormField
            label={t('listingForm.breed')}
            optional={t('common.optional')}
            error={errors.breed?.message}
          >
            <Input
              {...register('breed')}
              maxLength={60}
              placeholder={t('listingForm.breedPlaceholder')}
            />
          </FormField>

          <FormField
            label={t('listingForm.size')}
            optional={t('common.optional')}
            error={errors.size?.message}
          >
            {(ctl) => (
              <div className='relative'>
                <Input
                  {...ctl}
                  {...register('size')}
                  type='number'
                  inputMode='decimal'
                  min={0}
                  max={200}
                  step='0.1'
                  className='pr-10'
                />
                <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                  kg
                </span>
              </div>
            )}
          </FormField>
        </div>
      </Section>

      <Section
        title={t('listingForm.description')}
        description={t(`listingForm.descriptionHint.${type}`)}
      >
        <FormField
          error={errors.description?.message}
          hint={<span className='tabular-nums'>{description.length}/2000</span>}
        >
          <Textarea
            {...register('description')}
            rows={7}
            maxLength={2000}
            aria-label={t('listingForm.description')}
            placeholder={t(`listingForm.descriptionPlaceholder.${type}`)}
          />
        </FormField>
      </Section>

      <Section title={t('listingForm.health')}>
        <div className='grid gap-3 sm:grid-cols-3'>
          {TRAITS.map(([name, label]) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <label className='flex cursor-pointer items-center gap-2.5 rounded-lg border bg-card p-3 text-sm transition hover:bg-secondary/60'>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                  />
                  {t(label)}
                </label>
              )}
            />
          ))}
        </div>
        {isAdoption && (
          <div>
            <Label className='mb-3 block'>{t('listingForm.temperament')}</Label>
            <div className='grid gap-3 sm:grid-cols-3'>
              {TEMPERAMENT.map(([name, label]) => (
                <Controller
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <label className='flex cursor-pointer items-center gap-2.5 rounded-lg border bg-card p-3 text-sm transition hover:bg-secondary/60'>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(v === true)}
                      />
                      {t(label)}
                    </label>
                  )}
                />
              ))}
            </div>
          </div>
        )}
        <FormField
          label={t('listingForm.medicalNotes')}
          optional={t('common.optional')}
          error={errors.medical_notes?.message}
        >
          <Textarea
            {...register('medical_notes')}
            rows={3}
            maxLength={1000}
            placeholder={t('listingForm.medicalNotesPlaceholder')}
          />
        </FormField>
      </Section>

      {isAdoption && (
        <Section
          title={t('listingForm.fee')}
          description={t('listingForm.feeHint')}
        >
          <Controller
            control={control}
            name='fee_mode'
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className='grid-cols-1 sm:grid-cols-3'
              >
                {(['free', 'fee', 'unspecified'] as const).map((m) => (
                  <RadioCard key={m} value={m}>
                    {t(`listingForm.feeMode.${m}`)}
                  </RadioCard>
                ))}
              </RadioGroup>
            )}
          />
          {feeMode === 'fee' && (
            <FormField
              label={t('listingForm.feeAmount')}
              error={errors.adoption_fee?.message}
              required
              className='sm:max-w-xs'
            >
              {(ctl) => (
                <div className='relative'>
                  <Input
                    {...ctl}
                    {...register('adoption_fee')}
                    type='number'
                    inputMode='numeric'
                    min={1}
                    max={10000}
                    className='pr-10'
                  />
                  <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                    €
                  </span>
                </div>
              )}
            </FormField>
          )}
        </Section>
      )}

      <Section
        title={t('listingForm.location')}
        description={t(`listingForm.locationHint.${type}`)}
      >
        <Controller
          control={control}
          name='location'
          render={({ field }) => (
            <LocationPicker
              value={field.value}
              onChange={field.onChange}
              error={
                (errors.location as { city?: { message?: string } } | undefined)
                  ?.city?.message
              }
            />
          )}
        />
      </Section>

      <Section
        title={t('listingForm.contact')}
        description={t('listingForm.contactHint')}
      >
        <div className='grid gap-5 sm:grid-cols-2'>
          <FormField
            label={t('listingForm.phone')}
            optional={t('common.optional')}
            error={errors.phone_number?.message}
          >
            <Input
              {...register('phone_number')}
              type='tel'
              inputMode='tel'
              placeholder='+385 91 234 5678'
            />
          </FormField>
          <FormField
            label={t('listingForm.email')}
            optional={t('common.optional')}
            error={errors.email?.message}
          >
            <Input
              {...register('email')}
              type='email'
              inputMode='email'
              placeholder='ime@primjer.hr'
            />
          </FormField>
        </div>
      </Section>

      {isAdoption && (
        <Controller
          control={control}
          name='is_urgent'
          render={({ field }) => (
            <label
              className={cn(
                'flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-5 transition',
                field.value
                  ? 'border-terracotta-500 bg-terracotta-50'
                  : 'bg-card'
              )}
            >
              <span>
                <span className='block font-semibold'>
                  {t('listingForm.urgent')}
                </span>
                <span className='text-sm text-muted-foreground'>
                  {t('listingForm.urgentHint')}
                </span>
              </span>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </label>
          )}
        />
      )}

      <div className='sticky bottom-0 z-10 -mx-4 flex gap-3 border-t bg-background/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:justify-end sm:border-0 sm:bg-transparent sm:px-0'>
        <Button
          type='button'
          variant='outline'
          size='lg'
          onClick={onCancel}
          className='flex-1 sm:flex-none'
        >
          {t('common.cancel')}
        </Button>
        <Button
          type='submit'
          size='lg'
          loading={isPending}
          className='flex-1 sm:flex-none sm:min-w-48'
        >
          {mode === 'create' ? t('listingForm.publish') : t('listingForm.save')}
        </Button>
      </div>
    </form>
  );
};
