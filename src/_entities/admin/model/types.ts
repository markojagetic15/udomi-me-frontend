import type { Listing, ReportReason } from '../../listing';
import type { Language, PublicUser, ShelterStatus } from '../../user';

export interface AdminUser extends PublicUser {
  last_name: string;
  email: string;
  role: 'user' | 'admin';
  is_banned: boolean;
  is_verified: boolean;
  has_password: boolean;
  language: Language;
  shelter_status: ShelterStatus;
  updated_at: string;
}

export interface AdminUserRow extends AdminUser {
  listings_count: number;
  open_reports: number;
}

export type AdminListing = Omit<Listing, 'user'> & { user: AdminUser | null };
export type AdminListingRow = AdminListing & { open_reports: number };

export interface AdminReport {
  id: string;
  reason: ReportReason;
  details: string | null;
  status: 'open' | 'resolved' | 'dismissed';
  action: string | null;
  created_at: string;
  resolved_at: string | null;
  reporter: AdminUser | null;
  listing: AdminListing | null;
}

export type AdminActionType =
  | 'ban_user'
  | 'unban_user'
  | 'delete_user'
  | 'hide_listing'
  | 'unhide_listing'
  | 'delete_listing'
  | 'dismiss_report'
  | 'approve_shelter'
  | 'reject_shelter'
  | 'message_user'
  | 'broadcast_message';

export interface AdminActionEntry {
  id: string;
  action: AdminActionType;
  target_type: 'user' | 'listing' | 'report' | 'broadcast';
  target_id: string;
  target_label: string | null;
  created_at: string;
  admin: AdminUser | null;
}

export interface AdminUserDetail {
  user: AdminUser;
  listings: Omit<Listing, 'user'>[];
  reports_against: (Omit<AdminReport, 'listing'> & {
    listing: Omit<Listing, 'user'> | null;
  })[];
  reports_filed: (Omit<AdminReport, 'listing' | 'reporter'> & {
    listing: Omit<Listing, 'user'> | null;
  })[];
  history: AdminActionEntry[];
}

export interface AdminListingDetail {
  listing: AdminListing;
  reports: Omit<AdminReport, 'listing'>[];
  history: AdminActionEntry[];
}

export interface AdminStats {
  users: number;
  listings: number;
  adopted: number;
  openReports: number;
  pendingShelters: number;
  verifiedShelters: number;
  bannedUsers: number;
  hiddenListings: number;
}

export const USER_FILTERS = [
  'all',
  'reported',
  'banned',
  'unverified',
  'shelters',
  'admins',
] as const;
export type UserFilter = (typeof USER_FILTERS)[number];
export const LISTING_STATUSES = [
  'all',
  'reported',
  'active',
  'paused',
  'adopted',
  'hidden',
] as const;
export type ListingStatusFilter = (typeof LISTING_STATUSES)[number];
