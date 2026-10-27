export type NotificationType =
  | 'message'
  | 'interest'
  | 'saved_search_match'
  | 'listing_hidden'
  | 'listing_removed'
  | 'shelter_verified'
  | 'shelter_rejected'
  | 'shelter_application';

export interface AppNotification {
  id: string;
  type: NotificationType;
  data: Record<string, string | number | null>;
  is_read: boolean;
  created_at: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, string | number | boolean | string[]>;
  created_at: string;
}
