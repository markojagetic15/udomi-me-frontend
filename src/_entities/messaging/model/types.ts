import type { ListingType } from '../../listing';
import type { PublicUser } from '../../user';

export interface ConversationSummary {
  id: string;
  role: 'owner' | 'participant';
  // Thread started by an admin as the Udomi me team (no listing attached).
  is_support: boolean;
  other: PublicUser;
  other_banned: boolean;
  listing: {
    id: string;
    title: string;
    image: string | null;
    listing_type: ListingType;
    is_adopted: boolean;
  } | null;
  last_message_at: string;
  last_message_preview: string | null;
  unread: boolean;
}

export interface ChatMessage {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
  mine: boolean;
}
