import { useCreateListingPage } from '../hooks';
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
import { FaLocationDot } from 'react-icons/fa6';
import { Image, Progress, Tooltip } from '@nextui-org/react';
import { AreaCodesItems, CategoryItems, GenderItems } from '_entities/listing';
import { getLocalTimeZone, today } from '@internationalized/date';
import { IoMdCloseCircle } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

export const CreateListing = () => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleUploadImages,
    images,
    isPending,
    handleOnDateChange,
    handleGetCurrentLocation,
    address,
    setAddress,
    handleRemoveImage,
    onDragEnd,
  } = useCreateListingPage();

  return (
    <div className='w-full lg:max-w-6xl m-auto mt-24 pb-24 h-full'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='rounded-2xl p-12 flex flex-col gap-8 w-full isolate aspect-video bg-white/20 shadow-lg h-auto'
      >
        <Input
          register={register('title')}
          name='title'
          error={errors.title?.message}
          label='Title'
          isRequired
          description='The title must have at least 1 character'
          className='mb-2.5'
        />

        <TextArea
          register={register('description')}
          error={errors.description?.message}
          label='Description'
          name='description'
          isRequired
          description='The title must have at least 5 characters'
        />

        <div className='flex items-center w-full gap-4'>
          <Select
            label='Select Category'
            error={errors.category?.message}
            register={register('category')}
            items={CategoryItems}
            isRequired
          />

          <Select
            label='Select Gender'
            error={errors.gender?.message}
            register={register('gender')}
            items={GenderItems}
            isRequired
          />

          <Input
            label='Enter Size'
            error={errors.size?.message}
            register={register('size')}
            isRequired
            type='number'
            endIcon={<span className='text-gray-400'>kg</span>}
          />

          <Input
            register={register('breed')}
            name='breed'
            error={errors.breed?.message}
            label='Breed'
          />

          <DatePicker
            label='Birth date'
            error={errors.date_of_birth?.message}
            maxValue={today(getLocalTimeZone())}
            onChange={handleOnDateChange}
          />
        </div>

        <div className='flex items-center w-full gap-4'>
          <Switch register={register('is_vaccinated')} label='Is vaccinated' />
          <Switch
            register={register('is_urgent')}
            label='Is urgent'
            description='awdawdawd'
          />
        </div>

        <div className='flex gap-2.5 mb-2.5'>
          <Autocomplete
            label='Area code'
            items={AreaCodesItems}
            register={register('area_code')}
            className='w-44'
          />
          <Input
            register={register('phone_number')}
            name='phone_number'
            error={errors.phone_number?.message}
            label='Phone Number'
            description='The phone number will be used to contact you'
          />
        </div>

        <div className='flex items-center gap-2.5'>
          <Input
            name='address'
            label='Address'
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            description='The address will be used to show the location of the listing'
          />

          <Button
            variant='bordered'
            onClick={handleGetCurrentLocation}
            width='96'
            className='h-full text-md'
          >
            Get my location <FaLocationDot />
          </Button>
        </div>

        <div className='flex flex-col mt-4'>
          <div className='mb-2'>
            Images <span className='text-red-500'>*</span>
          </div>
          <div className='flex'>
            <DragDropContext
              onDragEnd={(result) => {
                onDragEnd(result);
              }}
            >
              <Droppable droppableId='droppable' direction='horizontal'>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className='flex'
                  >
                    {images.map((image, index) => (
                      <Draggable
                        key={image.id}
                        draggableId={image.id}
                        index={index}
                      >
                        {(provided) => (
                          <Tooltip content='You can re-order images'>
                            <div
                              className='relative cursor-pointer pr-2'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <IoMdCloseCircle
                                className='absolute -top-2 -right-2 cursor-pointer z-20 w-6 h-6 text-primary'
                                onClick={() => {
                                  handleRemoveImage(image.id);
                                }}
                              />
                              <Image
                                key={image.id}
                                src={image.url}
                                alt='listing'
                                className='w-32 h-32 object-cover'
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
                className={`w-32 h-32 ${errors.images?.message ? 'bg-danger-50' : 'bg-gray-400'} flex items-center justify-center rounded-2xl cursor-pointer`}
                onClick={() => {
                  document.getElementById('images-upload')?.click();
                }}
              >
                <FaPlus className='text-gray-300 w-6 h-6' />
              </div>
            )}
          </div>
          {errors.images?.message ? (
            <span className='text-red-500 text-xs mt-2'>
              {errors.images.message}
            </span>
          ) : (
            <span className='text-gray-400 text-xs mt-2'>
              Upload at least one image
            </span>
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
          description='Upload at least one image'
          width='64'
          id='images-upload'
        />

        <Button type='submit' variant='solid'>
          {isPending ? <Spinner /> : 'Create Listing'}
        </Button>
      </form>
    </div>
  );
};
