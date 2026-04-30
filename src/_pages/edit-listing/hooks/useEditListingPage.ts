import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { create_listing_schema } from '_features/listing';
import { uploadFile } from '_entities/resource';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Category, Image, useGetListing, useUpdateListing } from '_entities/listing';
import { DateValue } from '@nextui-org/react';
import { parseDate } from '@internationalized/date';
import { DropResult } from '@hello-pangea/dnd';

export const useEditListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState<DateValue | null>(null);
  const [initialDate, setInitialDate] = useState<DateValue | undefined>(undefined);

  const { getListing } = useGetListing(id ?? '');

  const { updateListing, isPending } = useUpdateListing({
    onSuccess: () => {
      toast.success('Listing updated successfully!');
      navigate(`/animal/${id}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver(create_listing_schema),
    mode: 'onSubmit',
    defaultValues: {
      images: [],
      date_of_birth: new Date(),
    },
  });

  useEffect(() => {
    const listing = getListing.data?.listing;
    if (!listing) return;

    reset({
      title: listing.title,
      description: listing.description ?? '',
      category: listing.category,
      gender: listing.gender,
      breed: listing.breed ?? '',
      size: listing.size,
      is_vaccinated: listing.is_vaccinated ?? false,
      is_urgent: listing.is_urgent ?? false,
      phone_number: listing.phone_number ?? '',
      email: listing.email ?? '',
      address: listing.address ?? '',
      area_code: listing.area_code ?? '',
      images: listing.images ?? [],
      date_of_birth: listing.date_of_birth ? new Date(listing.date_of_birth) : new Date(),
    });

    if (listing.images) setImages(listing.images);

    if (listing.date_of_birth) {
      const d = new Date(listing.date_of_birth);
      const pad = (n: number) => String(n).padStart(2, '0');
      try {
        setInitialDate(parseDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`));
      } catch {}
    }
  }, [getListing.data]);

  const onSubmit = async (data: {
    title: string;
    description: string;
    area_code?: string | null;
    phone_number?: string | null;
    category: Category;
    date_of_birth: Date;
    is_vaccinated?: boolean;
    is_urgent?: boolean;
    breed?: string | null;
    gender: 'male' | 'female';
    images: Image[];
  }) => {
    const date =
      dateOfBirth?.day && dateOfBirth?.month && dateOfBirth?.year
        ? new Date(dateOfBirth.year, dateOfBirth.month - 1, dateOfBirth.day)
        : data.date_of_birth;

    if (!date) {
      await trigger('date_of_birth');
      return;
    }

    updateListing({ id: id ?? '', data: { ...data, date_of_birth: date } });
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length + images.length > 8) {
      toast.error('You can only upload up to 8 images');
      return;
    }

    try {
      const placeholderImages = Array.from({ length: files.length }).map((_, index) => ({
        id: `placeholder-${index}`,
        url: 'placeholder',
        position: index,
      }));

      setImages([...images, ...placeholderImages]);

      const uploadPromises = [...files].map(async (file) => {
        if (file.size > 1024 * 1024 * 10) {
          toast.error('Image size must be less than 10MB');
        }
        const response = await uploadFile(file);
        if (!response) return null;
        return { id: response.id, url: response.url };
      });

      const uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean) as Image[];

      const updatedImages = images
        .filter((img) => !img.id.startsWith('placeholder'))
        .concat(uploadedImages.map((image, index) => ({ ...image, position: images.length + index })));

      setImages(updatedImages);
      setValue('images', [...(getValues('images') || []), ...updatedImages], { shouldValidate: true });
    } catch {
      toast.error('Failed to upload images');
    }
  };

  const handleOnDateChange = (date: DateValue | undefined) => {
    setDateOfBirth(date ?? null);
  };

  const handleRemoveImage = (imgId: string) => {
    const filtered = images.filter((img) => img.id !== imgId);
    if (filtered.length === 0) setValue('images', []);
    setImages(filtered);
  };

  const reorder = (list: Image[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = reorder(images, result.source.index, result.destination.index);
    setImages(items.map((item, index) => ({ ...item, position: index })));
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
    isLoading: getListing.isLoading,
    initialDate,
    navigate,
    listingId: id,
  };
};
