export type Album = {
  id: number;
  userId: number;
  title: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  website: string;
};

export type Photo = {
  id: number;
  albumId: number;
  thumbnailUrl: string;
  title: string;
  isFavorite: boolean;
};

export type PhotoComment = {
  photoId: number;
  comments: string[];
};
