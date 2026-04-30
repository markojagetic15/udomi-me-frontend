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

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className='mb-4'>
    <h2 className='text-base font-semibold text-gray-800'>{title}</h2>
    {subtitle && <p className='text-xs text-gray-400 mt-0.5'>{subtitle}</p>}
  </div>
);

export const EditListing = () => {
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
          className='text-gray-400 hover:text-primary transition-colors'
          aria-label='Go back'
        >
          <FaArrowLeftLong size={20} />
        </button>
        <div>
          <h1 className='text-3xl font-extrabold text-primary-700'>Edit Listing</h1>
          <p className='text-gray-500'>Update the details for your listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 px-4'>
        {/* Basic info */}
        <div className='bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-5'>
          <SectionHeader title='Basic Information' />
          <Input
            register={register('title')}
            name='title'
            error={errors.title?.message}
            label='Title'
            isRequired
            description='At least 3 characters'
          />
          <TextArea
            register={register('description')}
            error={errors.description?.message}
            label='Description'
            name='description'
            isRequired
            description='At least 5 characters'
          />
        </div>

        {/* Animal details */}
        <div className='bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-5'>
          <SectionHeader title='Animal Details' />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Select
              label='Category'
              error={errors.category?.message}
              register={register('category')}
              items={CategoryItems}
              isRequired
            />
            <Select
              label='Gender'
              error={errors.gender?.message}
              register={register('gender')}
              items={GenderItems}
              isRequired
            />
            <DatePicker
              label='Date of Birth'
              error={errors.date_of_birth?.message}
              maxValue={today(getLocalTimeZone())}
              onChange={handleOnDateChange}
              defaultValue={initialDate}
              isRequired
            />
            <Input
              label='Size'
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
              label='Breed'
            />
          </div>

          <div className='flex items-center gap-6 flex-wrap pt-1'>
            <Switch register={register('is_vaccinated')} label='Vaccinated' />
            <Switch
              register={register('is_urgent')}
              label='Urgent adoption'
              description='Animal needs immediate adoption'
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className='bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-5'>
          <SectionHeader title='Contact & Location' subtitle='Visible to potential adopters' />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Autocomplete
              label='Area code'
              items={AreaCodesItems}
              register={register('area_code')}
            />
            <Input
              register={register('phone_number')}
              name='phone_number'
              error={errors.phone_number?.message}
              label='Phone Number'
            />
            <Input
              register={register('email')}
              name='email'
              error={errors.email?.message}
              label='Email'
            />
          </div>
          <Input name='address' label='Address' register={register('address')} />
        </div>

        {/* Images */}
        <div className='bg-white rounded-3xl p-6 shadow-sm'>
          <SectionHeader title='Photos' subtitle='Drag to reorder. At least one photo required.' />
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
                          <Tooltip content='Drag to reorder'>
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
                className={`w-28 h-28 ${
                  errors.images?.message ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
                } flex items-center justify-center rounded-xl cursor-pointer border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors`}
                onClick={() => document.getElementById('images-upload-edit')?.click()}
              >
                <FaPlus className='text-gray-400 w-5 h-5' />
              </div>
            )}
          </div>

          {errors.images?.message ? (
            <p className='text-red-500 text-xs mt-3'>{errors.images.message}</p>
          ) : (
            <p className='text-gray-400 text-xs mt-3'>Upload up to 8 images</p>
          )}
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
          {isPending ? <Spinner /> : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};
