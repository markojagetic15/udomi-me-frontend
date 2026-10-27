import { useAxios } from '_app';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { errorMessage, toast } from '_shared';
import { ChatMessage } from '../model';

// Latest messages of an open thread, polled every 5s while visible. Fetching
// also marks the thread read server-side, so refresh the unread badges.
export const useGetMessages = (id: string | undefined) => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const getMessages = useQuery({
    queryKey: ['messages', id],
    queryFn: async (): Promise<ChatMessage[]> => {
      const res: ChatMessage[] = await axios.get(
        `/conversations/${id}/messages`
      );
      queryClient.invalidateQueries({ queryKey: ['conversations', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      return res;
    },
    enabled: !!id,
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
  });
  return { getMessages };
};

export const useSendMessage = (id: string | undefined) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (body: string): Promise<ChatMessage> =>
      axios.post(`/conversations/${id}/messages`, { body }),
    onSuccess: (message) => {
      queryClient.setQueryData<ChatMessage[]>(['messages', id], (old) => [
        ...(old ?? []),
        message,
      ]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { sendMessage: mutation.mutate, isPending: mutation.isPending };
};

export const useStartConversation = ({
  onSuccess,
}: { onSuccess?: (id: string) => void } = {}) => {
  const { axios } = useAxios();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (dto: {
      listing_id: string;
      body: string;
    }): Promise<{ id: string }> => axios.post('/conversations', dto),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onSuccess?.(id);
    },
    onError: (e) => toast.error(errorMessage(e, t)),
  });
  return { startConversation: mutation.mutate, isPending: mutation.isPending };
};
