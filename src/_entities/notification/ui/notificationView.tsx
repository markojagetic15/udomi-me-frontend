import type { TFunction } from 'i18next';
import {
  BadgeCheck,
  BadgeX,
  Bell,
  EyeOff,
  Heart,
  MessageCircle,
  Search,
  ShieldQuestion,
  Trash2,
} from 'lucide-react';
import { AppNotification } from '../model';

// Localized text, icon and link for a notification — the backend stores only
// type + data, so copy lives here in both languages.
export const notificationView = (n: AppNotification, t: TFunction) => {
  const d = n.data;
  switch (n.type) {
    case 'message':
      return {
        icon: <MessageCircle />,
        text: t('notifications.message', {
          name: d.from_name,
          title: d.listing_title ?? '',
        }),
        detail: d.preview as string,
        href: `/messages/${d.conversation_id}`,
      };
    case 'interest':
      return {
        icon: <Heart />,
        text: t('notifications.interest', {
          name: d.from_name,
          title: d.listing_title,
        }),
        href: `/animal/${d.listing_id}`,
      };
    case 'saved_search_match':
      return {
        icon: <Search />,
        text: t('notifications.savedSearch', {
          title: d.listing_title,
          search: d.saved_search_name,
        }),
        href: `/animal/${d.listing_id}`,
      };
    case 'listing_hidden':
      return {
        icon: <EyeOff />,
        text: t('notifications.listingHidden', { title: d.listing_title }),
        href: '/profile',
      };
    case 'listing_removed':
      return {
        icon: <Trash2 />,
        text: t('notifications.listingRemoved', { title: d.listing_title }),
        href: '/profile',
      };
    case 'shelter_verified':
      return {
        icon: <BadgeCheck />,
        text: t('notifications.shelterVerified', { name: d.shelter_name }),
        href: `/users/${d.user_id}`,
      };
    case 'shelter_rejected':
      return {
        icon: <BadgeX />,
        text: t('notifications.shelterRejected', { name: d.shelter_name }),
        href: '/profile?tab=settings',
      };
    case 'shelter_application':
      return {
        icon: <ShieldQuestion />,
        text: t('notifications.shelterApplication', { name: d.shelter_name }),
        href: '/admin?tab=shelters',
      };
    default:
      return {
        icon: <Bell />,
        text: t('notifications.generic'),
        href: '/notifications',
      };
  }
};
