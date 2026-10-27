import { useAxios } from '_app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorMessage, toast } from '_shared';
import { Listing, ListingInput, ReportReason } from '../model';

// Every write to a listing refreshes browse results, the owner's list and the
// single-listing cache.
const useInvalidateListings = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['listings'] }),
      queryClient.invalidateQueries({ queryKey: ['my-listings'] }),
      queryClient.invalidateQueries({ queryKey: ['user'] }),
    ]);
};

type Opts<T = void> = { onSuccess?: (data: T) => void };

export const useCreateListing = ({ onSuccess }: Opts<Listing> = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const invalidate = useInvalidateListings();
  const mutation = useMutation({
    mutationFn: (dto: ListingInput): Promise<{ listing: Listing }> =>
      axios.post('/listings', dto),
    onSuccess: async ({ listing }) => {
      await invalidate();
      toast.success(t('toast.listingCreated'));
      onSuccess?.(listing);
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { createListing: mutation.mutate, isPending: mutation.isPending };
};

export const useUpdateListing = ({ onSuccess }: Opts<Listing> = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const invalidate = useInvalidateListings();
  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ListingInput>;
    }): Promise<{ listing: Listing }> => axios.put(`/listings/${id}`, data),
    onSuccess: async ({ listing }) => {
      await invalidate();
      toast.success(t('toast.listingUpdated'));
      onSuccess?.(listing);
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { updateListing: mutation.mutate, isPending: mutation.isPending };
};

export const useDeleteListing = ({ onSuccess }: Opts = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const invalidate = useInvalidateListings();
  const mutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/listings/${id}`),
    onSuccess: async () => {
      await invalidate();
      toast.success(t('toast.listingDeleted'));
      onSuccess?.();
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { deleteListing: mutation.mutate, isPending: mutation.isPending };
};

export const useSetListingActive = () => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const invalidate = useInvalidateListings();
  const mutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      axios.post(`/listings/${id}/${active ? 'activate' : 'deactivate'}`),
    onSuccess: async (_, { active }) => {
      await invalidate();
      toast.success(
        active ? t('toast.listingActivated') : t('toast.listingPaused')
      );
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { setListingActive: mutation.mutate, isPending: mutation.isPending };
};

export const useMarkAsAdopted = ({ onSuccess }: Opts = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const invalidate = useInvalidateListings();
  const mutation = useMutation({
    mutationFn: ({
      id,
      adoption_story,
    }: {
      id: string;
      adoption_story?: string;
    }) => axios.post(`/listings/${id}/adopt`, { adoption_story }),
    onSuccess: async () => {
      await invalidate();
      toast.success(t('toast.markedAdopted'));
      onSuccess?.();
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { markAsAdopted: mutation.mutate, isPending: mutation.isPending };
};

export const useUpdateStory = ({ onSuccess }: Opts = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const invalidate = useInvalidateListings();
  const mutation = useMutation({
    mutationFn: ({
      id,
      adoption_story,
    }: {
      id: string;
      adoption_story?: string;
    }) => axios.put(`/listings/${id}/story`, { adoption_story }),
    onSuccess: async () => {
      await invalidate();
      toast.success(t('toast.saved'));
      onSuccess?.();
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { updateStory: mutation.mutate, isPending: mutation.isPending };
};

export const useReportListing = ({ onSuccess }: Opts = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: ({
      id,
      reason,
      details,
    }: {
      id: string;
      reason: ReportReason;
      details?: string;
    }) => axios.post(`/listings/${id}/report`, { reason, details }),
    onSuccess: () => {
      toast.success(t('report.sent'));
      onSuccess?.();
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { reportListing: mutation.mutate, isPending: mutation.isPending };
};
