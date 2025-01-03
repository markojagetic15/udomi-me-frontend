import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { create_listing_schema } from '_features/listing';
import { uploadFile } from '_entities/resource';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Category, useCreateListing } from '_entities/listing';
import { DateValue } from '@nextui-org/react';
import axios from 'axios';

export const useCreateListingPage = () => {
  const [images, setImages] = useState<
    {
      url: string;
      id: string;
    }[]
  >([]);
  const [imagesUploadingProgress, setImagesUploadingProgress] =
    useState<number>(0);
  const [dateOfBirth, setDateOfBirth] = useState<DateValue | undefined>();
  const [address, setAddress] = useState<string | undefined>(undefined);

  const { createListing, isPending } = useCreateListing();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(create_listing_schema),
    mode: 'onSubmit',
  });

  const onSubmit = (data: {
    title: string;
    description: string;
    area_code?: string | null;
    phone_number?: string | null;
    category: Category;
    date_of_birth?: Date | null;
    is_vaccinated?: boolean;
    breed?: string | null;
    gender: 'male' | 'female';
  }) => {
    if (images.length === 0) {
      setError('images', {
        type: 'manual',
        message: 'Please upload at least one image',
      });
      return;
    }

    const date =
      dateOfBirth?.day && dateOfBirth?.month && dateOfBirth?.year
        ? new Date(dateOfBirth.year, dateOfBirth.month, dateOfBirth.day)
        : undefined;

    const newData = {
      ...data,
      date_of_birth: date,
      images: images,
      address,
    };

    createListing(newData);

    toast.success('Listing created successfully!');

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagesUploadingProgress(1);

    const files = e.target.files;

    if (!files) return;

    const uploadPromises = [...files].map(async (file) => {
      const response = await uploadFile(file);

      if (!response) return null;

      const publicUrl = `https://${import.meta.env.VITE_S3_BUCKET_NAME || ''}.s3.${import.meta.env.VITE_AWS_REGION || ''}.amazonaws.com/${file.name}`;
      const id = response.ETag || '';

      return { id, url: publicUrl };
    });

    const imagesArray = (await Promise.all(uploadPromises)).filter(
      (image) => image !== null
    );

    setImagesUploadingProgress(100);

    setImages((prevState) => [...prevState, ...imagesArray]);

    setTimeout(() => {
      setImagesUploadingProgress(0);
    }, 1000);
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
      setValue('images', '');
    }

    setImages(filteredImages);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
    handleUploadImages,
    images,
    imagesUploadingProgress,
    handleOnDateChange,
    handleGetCurrentLocation,
    address,
    setAddress,
    handleRemoveImage,
  };
};
