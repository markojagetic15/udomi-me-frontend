export interface User {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
  created_at: Date;
  avatar: string;
}

export interface GetUserDto {
  id: string;
}
