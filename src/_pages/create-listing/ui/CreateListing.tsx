import { useCreateListingPage } from '../hooks';
import {
  Button,
  DatePicker,
  Input,
  LocationPicker,
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
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';

const CharCount = ({ value, max }: { value: string; max: number }) => (
  <span className={`text-xs tabular-nums ${value.length >= max ? 'text-red-400' : 'text-gray-400'}`}>
    {value.length}/{max}
  </span>
);

export const CreateListing = () => {
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
    handleLocationChange,
    titleValue,
    descriptionValue,
    locationValue,
  } = useCreateListingPage();

  return (
    <div className='w-full lg:max-w-4xl m-auto mt-24 pb-24'>
      <div className='px-4'>
        <h1 className='text-3xl font-extrabold text-primary-700 mb-2'>{t('createListing.title')}</h1>
        <p className='text-gray-500 mb-8'>{t('createListing.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 px-4'>
        {/* Basic info */}
        <div className='bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-5'>
          <div className='mb-4'>
            <h2 className='text-base font-semibold text-gray-800'>{t('createListing.sections.basicInfo')}</h2>
          </div>
          <div className='flex flex-col gap-1'>
            <Input
              register={register('title')}
              name='title'
              error={errors.title?.message}
              label={t('createListing.fields.title')}
              isRequired
              maxLength={50}
            />
            <div className='flex justify-end pr-1'>
              <CharCount value={titleValue} max={50} />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <TextArea
              register={register('description')}
              error={errors.description?.message}
              label={t('createListing.fields.description')}
              name='description'
              isRequired
              maxLength={500}
            />
            <div className='flex justify-end pr-1'>
              <CharCount value={descriptionValue} max={500} />
            </div>
          </div>
        </div>

        {/* Animal details */}
        <div className='bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-5'>
          <div className='mb-4'>
            <h2 className='text-base font-semibold text-gray-800'>{t('createListing.sections.animalDetails')}</h2>
          </div>
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

          <div className='flex items-center gap-6 flex-wrap pt-1'>
            <Switch register={register('is_vaccinated')} label={t('createListing.fields.vaccinated')} />
            <Switch
              register={register('is_urgent')}
              label={t('createListing.fields.urgentAdoption')}
              description={t('createListing.fields.urgentDesc')}
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className='bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-5'>
          <div className='mb-4'>
            <h2 className='text-base font-semibold text-gray-800'>{t('createListing.sections.contactLocation')}</h2>
            <p className='text-xs text-gray-400 mt-0.5'>{t('createListing.sections.contactSubtitle')}</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
          <div>
            <label className='text-sm font-medium text-gray-700 mb-2 block'>
              {t('createListing.fields.address')}{' '}
              <span className='text-gray-400 font-normal text-xs'>{t('createListing.fields.addressHint')}</span>
            </label>
            <LocationPicker
              value={locationValue.lat ? locationValue : undefined}
              onChange={handleLocationChange}
            />
          </div>
        </div>

        {/* Images */}
        <div className='bg-white rounded-3xl p-6 shadow-sm'>
          <div className='mb-4'>
            <h2 className='text-base font-semibold text-gray-800'>{t('createListing.sections.photos')}</h2>
            <p className='text-xs text-gray-400 mt-0.5'>{t('createListing.sections.photosSubtitle')}</p>
          </div>
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
                                className='absolute -top-2 -right-2 cursor-pointer z-20 w-5 h-5 text-primary bg-white rounded-full'
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
                className='w-28 h-28 bg-gray-50 border-gray-200 flex items-center justify-center rounded-xl cursor-pointer border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors'
                onClick={() => document.getElementById('images-upload')?.click()}
              >
                <FaPlus className='text-gray-400 w-5 h-5' />
              </div>
            )}
          </div>
          <p className='text-gray-400 text-xs mt-3'>{t('createListing.sections.uploadHint')}</p>
        </div>

        <Input
          label='Images'
          name='images'
          type='file'
          onChange={handleUploadImages}
          multiple
          className='hidden'
          id='images-upload'
        />

        <Button type='submit' variant='solid' className='rounded-2xl h-12 text-base font-semibold'>
          {isPending ? <Spinner /> : t('createListing.publish')}
        </Button>
      </form>
    </div>
  );
};
