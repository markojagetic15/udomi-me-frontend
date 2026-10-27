import { useAxios } from '_app';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ConversationSummary } from '../model';

export const useGetConversations = (page = 1) => {
  const { axios } = useAxios();
  const getConversations = useQuery({
    queryKey: ['conversations', page],
    queryFn: async (): Promise<{
      conversations: ConversationSummary[];
      meta: { totalPages: number };
    }> => axios.get(`/conversations?page=${page}&limit=30`),
    placeholderData: keepPreviousData,
    refetchInterval: 20_000,
  });
  return { getConversations };
};

export const useGetConversation = (id: string | undefined) => {
  const { axios } = useAxios();
  const getConversation = useQuery({
    queryKey: ['conversation', id],
    queryFn: async (): Promise<ConversationSummary> =>
      axios.get(`/conversations/${id}`),
    enabled: !!id,
  });
  return { getConversation };
};

// Polled by the header badge.
export const useUnreadMessagesCount = (enabled: boolean) => {
  const { axios } = useAxios();
  const getUnreadMessages = useQuery({
    queryKey: ['conversations', 'unread'],
    queryFn: async (): Promise<{ count: number }> =>
      axios.get('/conversations/unread-count'),
    enabled,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
  return { unreadMessages: getUnreadMessages.data?.count ?? 0 };
};
