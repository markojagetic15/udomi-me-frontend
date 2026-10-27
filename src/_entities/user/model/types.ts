import type { Listing } from '../../listing';

export type Language = 'hr' | 'en';
export type ShelterStatus = 'none' | 'pending' | 'verified' | 'rejected';

// What anyone may see about another user (backend: publicUser()).
export interface PublicUser {
  id: string;
  first_name: string;
  last_initial: string;
  avatar_url: string | null;
  account_type: 'individual' | 'shelter';
  shelter_status: ShelterStatus;
  shelter_name: string | null;
  shelter_city: string | null;
  shelter_description: string | null;
  shelter_website: string | null;
  shelter_phone: string | null;
  created_at: string;
}

// GET /me — the logged-in user's own full record.
export interface Me {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  // True once the server can send email — then posting/messaging needs is_verified.
  verification_required: boolean;
  role: 'user' | 'admin';
  language: Language;
  email_notifications: boolean;
  avatar_url: string | null;
  account_type: 'individual' | 'shelter';
  shelter_status: ShelterStatus;
  shelter_name: string | null;
  shelter_description: string | null;
  shelter_city: string | null;
  shelter_website: string | null;
  shelter_phone: string | null;
  created_at: string;
  favorite_listings: Listing[];
  interested_listings: Listing[];
}

export interface PublicProfile {
  user: PublicUser;
  stats: { active_listings: number; adopted: number };
}

export const isVerifiedShelter = (
  u: Pick<PublicUser, 'account_type' | 'shelter_status'> | null | undefined
) => u?.account_type === 'shelter' && u.shelter_status === 'verified';

export const publicName = (u: PublicUser | null | undefined) =>
  !u
    ? ''
    : isVerifiedShelter(u) && u.shelter_name
      ? u.shelter_name
      : `${u.first_name} ${u.last_initial}`.trim();

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
