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
import { Image, Progress } from '@nextui-org/react';
import { AreaCodesItems, CategoryItems, GenderItems } from '_entities/listing';
import { getLocalTimeZone, today } from '@internationalized/date';
import { IoMdCloseCircle } from 'react-icons/io';

export const CreateListing = () => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleUploadImages,
    images,
    imagesUploadingProgress,
    isPending,
    handleOnDateChange,
    handleGetCurrentLocation,
    address,
    setAddress,
    handleRemoveImage,
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

        <Input
          error={errors.images?.message}
          label='Images'
          name='images'
          type='file'
          onChange={handleUploadImages}
          multiple
          className='mt-6 cursor-pointer w-64'
          isRequired
          register={register('images')}
          description='Upload at least one image'
        />

        {imagesUploadingProgress !== 0 && (
          <Progress
            aria-label='Loading...'
            value={imagesUploadingProgress}
            className='max-w-md'
          />
        )}

        <div className='flex gap-2 items-center mt-6'>
          {images.map((image) => (
            <div className='relative'>
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
              />
            </div>
          ))}
        </div>

        <Button type='submit' variant='solid'>
          {isPending ? <Spinner /> : 'Create Listing'}
        </Button>
      </form>
    </div>
  );
};
