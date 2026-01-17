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

export interface PostRequest {
  id: number;
  title: string;
  slug: string;
  content: string;
  authorId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  author?: UserResponse;
}

export interface CreatePostRequest {
  title: string;
  slug: string;
  content: string;
  authorId: string;
}
