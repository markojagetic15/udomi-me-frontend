import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { create_listing_schema } from '_features/listing';
import { uploadFile } from '_entities/resource';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Category, Image, useCreateListing } from '_entities/listing';
import { DateValue } from '@nextui-org/react';
import axios from 'axios';
import { DropResult } from '@hello-pangea/dnd';

export const useCreateListingPage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState<DateValue | undefined>();
  const [address, setAddress] = useState<string | undefined>(undefined);

  const { createListing, isPending } = useCreateListing();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(create_listing_schema),
    mode: 'onSubmit',
    defaultValues: {
      images: [],
    },
  });

  const onSubmit = async (data: {
    title: string;
    description: string;
    area_code?: string | null;
    phone_number?: string | null;
    category: Category;
    date_of_birth?: Date | null;
    is_vaccinated?: boolean;
    breed?: string | null;
    gender: 'male' | 'female';
    images: Image[];
  }) => {
    const date =
      dateOfBirth?.day && dateOfBirth?.month && dateOfBirth?.year
        ? new Date(dateOfBirth.year, dateOfBirth.month, dateOfBirth.day)
        : undefined;

    const newData = {
      ...data,
      date_of_birth: date,
      address,
    };

    createListing(newData);

    toast.success('Listing created successfully!');

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    if (files.length + images.length > 8) {
      toast.error('You can only upload 8 images');
      return;
    }

    try {
      const placeholderImages = Array.from({ length: files.length }).map(
        (_, index) => ({
          id: index.toString(),
          url: 'placeholder',
          position: index,
        })
      );

      setImages([...images, ...placeholderImages]);

      const uploadPromises = [...files].map(async (file) => {
        if (file.size > 1024 * 1024 * 5) {
          toast.error('Image size must be less than 5MB');
        }

        const response = await uploadFile(file);

        if (!response) return null;

        const publicUrl = `https://${import.meta.env.VITE_S3_BUCKET_NAME || ''}.s3.${import.meta.env.VITE_AWS_REGION || ''}.amazonaws.com/${file.name}`;
        const id = response.ETag || '';

        return { id, url: publicUrl };
      });

      const uploadedImages = (await Promise.all(uploadPromises)).filter(
        (image) => image !== null
      );

      const updatedImages = images
        .filter((img) => img.id !== 'placeholder')
        .concat(
          uploadedImages.map((image, index) => ({
            ...image,
            position: images.length + index,
          }))
        );

      setImages([...updatedImages]);

      setValue('images', [...(getValues('images') || []), ...updatedImages], {
        shouldValidate: true,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload images');
    }
  };

  const handleOnDateChange = (date: DateValue | undefined) => {
    setDateOfBirth(date);
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const address = response.data.display_name;

        setAddress(address);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleRemoveImage = (id: string) => {
    const filteredImages = images.filter((image) => image.id !== id);

    if (filteredImages.length === 0) {
      setValue('images', []);
      const input = document.getElementById(
        'images-upload'
      ) as HTMLInputElement;

      if (input) {
        input.value = '';
      }
    }

    setImages(filteredImages);
  };

  const reorder = (list: Image[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      images,
      result.source.index,
      result.destination.index
    );

    const newOrder = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setImages(newOrder);
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
    handleGetCurrentLocation,
    address,
    setAddress,
    handleRemoveImage,
    onDragEnd,
  };
};
