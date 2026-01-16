export interface UserResponse {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  image: string | null;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersApiResponse {
  users: UserResponse[];
}
