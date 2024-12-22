import { useCreateListingPage } from '../hooks';
import { Button, Checkbox, Input, Spinner, TextArea } from '_shared';
import {
  DatePicker,
  Image,
  Progress,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { CategoryItems, GenderItems } from '_entities/listing';

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
  } = useCreateListingPage();

  return (
    <div className='w-screen h-screen p-40 pt-12'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='rounded-2xl bg-green-100 p-12 flex flex-col gap-6 w-full'
      >
        <Input
          register={register('title')}
          name='title'
          error={errors.title?.message}
          label='Title'
          isRequired
        />

        <TextArea
          register={register('description')}
          error={errors.description?.message}
          label='Description'
          name='description'
          isRequired
        />

        <div className='flex items-center w-full gap-4'>
          <Select
            label='Select Category'
            className='max-w-xs'
            errorMessage={errors.category?.message}
            {...register('category')}
            isInvalid={!!errors.category?.message}
          >
            {CategoryItems.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>

          <Select
            label='Select Gender'
            className='max-w-xs'
            errorMessage={errors.gender?.message}
            {...register('gender')}
            isInvalid={!!errors.gender?.message}
          >
            {GenderItems.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>

          <Input
            register={register('breed')}
            name='breed'
            error={errors.breed?.message}
            label='Breed'
            width='w-64'
            isRequired
          />

          <DatePicker
            label='Birth date'
            className='max-w-[284px]'
            errorMessage={errors.date_of_birth?.message}
          />

          <Checkbox
            register={register('is_vaccinated')}
            error={errors.is_vaccinated?.message}
            label='Vaccinated'
          />
        </div>

        <Input
          register={register('email')}
          name='email'
          error={errors.email?.message}
          label='Email'
          isRequired
        />

        <Input
          register={register('phone_number')}
          name='phone_number'
          error={errors.phone_number?.message}
          label='Phone Number'
        />

        <Input
          register={register('address')}
          name='address'
          error={errors.address?.message}
          label='Address'
        />

        <Input
          error={errors.images?.message}
          label='Images'
          name='Images'
          type='file'
          onChange={handleUploadImages}
          multiple
        />

        {imagesUploadingProgress !== 0 && (
          <Progress
            aria-label='Loading...'
            value={imagesUploadingProgress}
            className='max-w-md'
          />
        )}

        <div className='flex gap-2 items-center'>
          {images.map((image) => (
            <Image
              key={image.id}
              src={image.url}
              alt='listing'
              className='w-32 h-32 object-cover'
            />
          ))}
        </div>

        <Button type='submit' variant='flat'>
          {isPending ? <Spinner /> : 'Create Listing'}
        </Button>
      </form>
    </div>
  );
};
