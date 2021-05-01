import { useMemo } from "react";

import { Album, Photo } from "../common/types";

type Props = {
  albums: Album[];
  photos: Photo[];
};
export function FavoritePhotos({ photos, albums }: Props) {
  const favoritePhotos = useMemo(
    () => photos.filter((photo) => photo.isFavorite),
    [photos],
  );

  return (
    <div className="favorite-photo">
      <ul>
        {favoritePhotos.map((photo, idx) => (
          <li key={idx}>
            {photo.title}
            <img src={photo.thumbnailUrl} alt={photo.title} />
            From album:{" "}
            {albums.find((album) => album.id === photo.albumId)?.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
