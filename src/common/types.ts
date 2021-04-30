export type Album = {
  id: number;
  userId: number;
  title: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Photo = {
  albumId: number;
  thumbnailUrl: string;
};
