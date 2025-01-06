import { Listing } from '../../listing';

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
  created_at: Date;
  avatar: string;
  favorite_listings: Listing[];
}

export interface GetUserDto {
  id: string;
}
