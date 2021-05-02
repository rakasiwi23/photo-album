import { useMemo } from "react";

import { Album, Photo } from "../common/types";
import "../assets/styles/favorite.css";

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
        {favoritePhotos.length ? (
          favoritePhotos.map((photo, idx) => (
            <li key={idx}>
              <div className="title">Name: {photo.title}</div>
              <img src={photo.thumbnailUrl} alt={photo.title} />
              <div className="album-title">
                Album:{" "}
                {albums.find((album) => album.id === photo.albumId)?.title}
              </div>
            </li>
          ))
        ) : (
          <div>No Favorite Photos</div>
        )}
      </ul>
    </div>
  );
}
