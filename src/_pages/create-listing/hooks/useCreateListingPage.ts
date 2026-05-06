import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { create_listing_schema } from '_features/listing';
import { uploadFile } from '_entities/resource';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Category, Image, useCreateListing } from '_entities/listing';
import { useTranslation } from 'react-i18next';
import { DateValue } from '@nextui-org/react';
import { DropResult } from '@hello-pangea/dnd';

export const useCreateListingPage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState<DateValue | null>();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { createListing, isPending } = useCreateListing({
    onSuccess: () => {
      toast.success(t('toast.listingCreated'));
      navigate('/browse');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(create_listing_schema(t)),
    mode: 'onSubmit',
    defaultValues: {
      images: [],
      date_of_birth: new Date(),
    },
  });

  const titleValue = watch('title') ?? '';
  const descriptionValue = watch('description') ?? '';

  const onSubmit = async (data: {
    title: string;
    description: string;
    area_code?: string | null;
    phone_number?: string | null;
    category: Category;
    date_of_birth: Date;
    is_vaccinated?: boolean;
    breed?: string | null;
    gender: 'male' | 'female';
    images?: Image[];
    lat?: number;
    lng?: number;
  }) => {
    const date =
      dateOfBirth?.day && dateOfBirth?.month && dateOfBirth?.year
        ? new Date(dateOfBirth.year, dateOfBirth.month, dateOfBirth.day)
        : undefined;

    if (!date) {
      await trigger('date_of_birth');
      return;
    }

    createListing({ ...data, date_of_birth: date });
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length + images.length > 8) {
      toast.error(t('toast.imagesLimit'));
      return;
    }

    try {
      const placeholderImages = Array.from({ length: files.length }).map((_, i) => ({
        id: i.toString(),
        url: 'placeholder',
        position: i,
      }));
      setImages([...images, ...placeholderImages]);

      const uploadedImages = (
        await Promise.all(
          [...files].map(async (file) => {
            if (file.size > 1024 * 1024 * 10) toast.error(t('toast.imageTooLarge'));
            const response = await uploadFile(file);
            if (!response) return null;
            return { id: response.id, url: response.url };
          }),
        )
      ).filter(Boolean) as Image[];

      const updatedImages = images
        .filter((img) => img.id !== 'placeholder')
        .concat(uploadedImages.map((img, i) => ({ ...img, position: images.length + i })));

      setImages(updatedImages);
      setValue('images', [...(getValues('images') || []), ...updatedImages], { shouldValidate: true });
    } catch {
      toast.error(t('toast.imageUploadFailed'));
    }
  };

  const handleOnDateChange = (date: DateValue | undefined) => setDateOfBirth(date);

  const handleRemoveImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length === 0) {
      setValue('images', []);
      const input = document.getElementById('images-upload') as HTMLInputElement;
      if (input) input.value = '';
    }
    setImages(filtered);
  };

  const reorder = (list: Image[], from: number, to: number) => {
    const result = [...list];
    const [removed] = result.splice(from, 1);
    result.splice(to, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setImages(
      reorder(images, result.source.index, result.destination.index).map((item, i) => ({
        ...item,
        position: i,
      })),
    );
  };

  const handleLocationChange = (v: { address: string; lat: number; lng: number }) => {
    setValue('address', v.address);
    setValue('lat', v.lat);
    setValue('lng', v.lng);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
    handleUploadImages,
    images,
    handleOnDateChange,
    handleRemoveImage,
    onDragEnd,
    handleLocationChange,
    titleValue,
    descriptionValue,
    locationValue: {
      address: (watch('address') ?? '') as string,
      lat: watch('lat') ?? 0,
      lng: watch('lng') ?? 0,
    },
  };
};
