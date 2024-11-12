import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { create_listing_schema, useCreateListing } from '_features/listing';
import { uploadFile } from '_entities/resource';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Category } from '_entities/listing';

export const useCreateListingPage = () => {
  const [images, setImages] = useState<
    {
      url: string;
      id: string;
    }[]
  >([]);

  const [imagesUploadingProgress, setImagesUploadingProgress] =
    useState<number>(0);

  const { createListing, isPending } = useCreateListing();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(create_listing_schema),
  });

  const onSubmit = (data: {
    title: string;
    description: string;
    address: string;
    phone_number: string;
    email: string;
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

    createListing({ ...data, images: images });

    toast.success(
      'Listing created successfully! Redirecting to My Listings...'
    );

    setTimeout(() => {
      navigate('/my-listings');
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

    setImages(imagesArray);

    setTimeout(() => {
      setImagesUploadingProgress(0);
    }, 1000);
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
  };
};
