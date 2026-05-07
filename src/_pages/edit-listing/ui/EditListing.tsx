import { useEditListingPage } from '../hooks';
import {
  Autocomplete,
  Button,
  DatePicker,
  Input,
  Select,
  Spinner,
  Switch,
  TextArea,
} from '_shared';
import { Image as NextImage, Tooltip } from '@nextui-org/react';
import { AreaCodesItems, CategoryItems, GenderItems } from '_entities/listing';
import { getLocalTimeZone, today } from '@internationalized/date';
import { IoMdCloseCircle } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';

const SectionCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className='bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden'>
    <div className='px-6 py-5 border-b border-gray-100 bg-gray-50/40'>
      <h2 className='text-base font-bold text-gray-800'>{title}</h2>
      {subtitle && <p className='text-xs text-gray-400 mt-0.5'>{subtitle}</p>}
    </div>
    <div className='p-6 flex flex-col gap-5'>
      {children}
    </div>
  </div>
);

export const EditListing = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleUploadImages,
    images,
    isPending,
    handleOnDateChange,
    handleRemoveImage,
    onDragEnd,
    isLoading,
    initialDate,
    navigate,
    listingId,
  } = useEditListingPage();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='w-full lg:max-w-4xl m-auto mt-24 pb-24'>
      <div className='px-4 flex items-center gap-4 mb-8'>
        <button
          onClick={() => navigate(`/animal/${listingId}`)}
          className='w-9 h-9 rounded-xl flex items-center justify-center bg-white/70 text-gray-400 hover:text-primary hover:bg-white transition-all shadow-sm border border-gray-100'
          aria-label='Go back'
        >
          <FaArrowLeftLong size={16} />
        </button>
        <div>
          <h1 className='text-3xl font-extrabold text-primary-700'>{t('editListing.title')}</h1>
          <p className='text-gray-500 text-sm mt-0.5'>{t('editListing.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 px-4'>
        {/* Basic info */}
        <SectionCard title={t('createListing.sections.basicInfo')}>
          <Input
            register={register('title')}
            name='title'
            error={errors.title?.message}
            label={t('createListing.fields.title')}
            isRequired
            description={t('editListing.atLeast3')}
          />
          <TextArea
            register={register('description')}
            error={errors.description?.message}
            label={t('createListing.fields.description')}
            name='description'
            isRequired
            description={t('editListing.atLeast5')}
          />
        </SectionCard>

        {/* Animal details */}
        <SectionCard title={t('createListing.sections.animalDetails')}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Select
              label={t('createListing.fields.category')}
              error={errors.category?.message}
              register={register('category')}
              items={CategoryItems.map((item) => ({ ...item, label: t(`categories.${item.key}`) }))}
              isRequired
            />
            <Select
              label={t('createListing.fields.gender')}
              error={errors.gender?.message}
              register={register('gender')}
              items={GenderItems.map((item) => ({ ...item, label: t(`genders.${item.key}`) }))}
              isRequired
            />
            <DatePicker
              label={t('createListing.fields.dateOfBirth')}
              error={errors.date_of_birth?.message}
              maxValue={today(getLocalTimeZone())}
              onChange={handleOnDateChange}
              defaultValue={initialDate}
              isRequired
            />
            <Input
              label={t('createListing.fields.size')}
              error={errors.size?.message}
              register={register('size')}
              isRequired
              type='number'
              endIcon={<span className='text-gray-400 text-sm'>kg</span>}
            />
            <Input
              register={register('breed')}
              name='breed'
              error={errors.breed?.message}
              label={t('createListing.fields.breed')}
            />
          </div>

          <div className='flex items-center gap-6 flex-wrap'>
            <Switch register={register('is_vaccinated')} label={t('createListing.fields.vaccinated')} />
            <Switch
              register={register('is_urgent')}
              label={t('createListing.fields.urgentAdoption')}
              description={t('createListing.fields.urgentDesc')}
            />
          </div>
        </SectionCard>

        {/* Contact & Location */}
        <SectionCard
          title={t('createListing.sections.contactLocation')}
          subtitle={t('createListing.sections.contactSubtitle')}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Autocomplete
              label={t('createListing.fields.areaCode')}
              items={AreaCodesItems}
              register={register('area_code')}
            />
            <Input
              register={register('phone_number')}
              name='phone_number'
              error={errors.phone_number?.message}
              label={t('createListing.fields.phoneNumber')}
            />
            <Input
              register={register('email')}
              name='email'
              error={errors.email?.message}
              label={t('createListing.fields.email')}
            />
          </div>
          <Input name='address' label={t('createListing.fields.address')} register={register('address')} />
        </SectionCard>

        {/* Images */}
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden'>
          <div className='px-6 py-5 border-b border-gray-100 bg-gray-50/40'>
            <h2 className='text-base font-bold text-gray-800'>{t('createListing.sections.photos')}</h2>
            <p className='text-xs text-gray-400 mt-0.5'>{t('editListing.photosSubtitle')}</p>
          </div>
          <div className='p-6'>
            <div className='flex flex-wrap gap-2'>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='droppable' direction='horizontal'>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className='flex flex-wrap gap-2'
                    >
                      {images.map((image, index) => (
                        <Draggable key={image.id} draggableId={image.id} index={index}>
                          {(provided) => (
                            <Tooltip content={t('createListing.dragToReorder')}>
                              <div
                                className='relative cursor-grab active:cursor-grabbing'
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <IoMdCloseCircle
                                  className='absolute -top-2 -right-2 cursor-pointer z-20 w-5 h-5 text-primary bg-white rounded-full shadow-sm'
                                  onClick={() => handleRemoveImage(image.id)}
                                />
                                <NextImage
                                  src={image.url}
                                  alt='listing'
                                  className='w-28 h-28 object-cover rounded-xl'
                                  isLoading={image.url === 'placeholder'}
                                />
                              </div>
                            </Tooltip>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {images.length < 8 && (
                <div
                  className={`w-28 h-28 flex flex-col items-center justify-center rounded-xl cursor-pointer border-2 border-dashed transition-colors gap-1 ${
                    errors.images?.message
                      ? 'bg-red-50 border-red-300 hover:border-red-400'
                      : 'bg-gray-50 border-gray-200 hover:border-primary hover:bg-primary/5'
                  }`}
                  onClick={() => document.getElementById('images-upload-edit')?.click()}
                >
                  <FaPlus className='text-gray-300 w-5 h-5' />
                  <span className='text-[10px] text-gray-300'>Add photo</span>
                </div>
              )}
            </div>

            {errors.images?.message ? (
              <p className='text-red-500 text-xs mt-3'>{errors.images.message}</p>
            ) : (
              <p className='text-gray-400 text-xs mt-3'>{t('editListing.uploadHint')}</p>
            )}
          </div>
        </div>

        <Input
          error={errors.images?.message}
          label='Images'
          name='images'
          type='file'
          onChange={handleUploadImages}
          multiple
          className='hidden'
          isRequired
          id='images-upload-edit'
        />

        <Button type='submit' variant='solid' className='rounded-2xl h-12 text-base font-semibold'>
          {isPending ? <Spinner /> : t('editListing.save')}
        </Button>
      </form>
    </div>
  );
};
