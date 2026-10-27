import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetConversation,
  useGetConversations,
  useGetMessages,
  useSendMessage,
} from '_entities/messaging';

export const useMessagesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getConversations } = useGetConversations();
  const { getConversation } = useGetConversation(id);
  const { getMessages } = useGetMessages(id);
  const { sendMessage, isPending: isSending } = useSendMessage(id);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = getMessages.data ?? [];
  const lastId = messages[messages.length - 1]?.id;

  // Keep the newest message in view whenever one arrives.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [lastId, id]);

  useEffect(() => {
    setDraft('');
  }, [id]);

  const send = () => {
    const body = draft.trim();
    if (!body || isSending) return;
    sendMessage(body, { onSuccess: () => setDraft('') });
  };

  return {
    activeId: id,
    conversations: getConversations.data?.conversations ?? [],
    conversationsLoading: getConversations.isLoading,
    conversation: getConversation.data,
    conversationError: getConversation.isError,
    messages,
    messagesLoading: getMessages.isLoading,
    draft,
    setDraft,
    send,
    isSending,
    bottomRef,
    back: () => navigate('/messages'),
  };
};
