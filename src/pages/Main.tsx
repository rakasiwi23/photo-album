import { useMemo, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { Album, User, Photo } from "../common/types";
import { Error } from "../components/Error";
import "../assets/styles/main.css";
import albumIcon from "../assets/images/album-icon.svg";
import personIcon from "../assets/images/person-icon.svg";

type ListAlbum = {
  albumId: number;
  name: string;
  userId: number;
  user: string;
  thumbnail: string;
};

type Props = {
  albums: Album[];
  users: User[];
  photos: Photo[];
  isFetching: boolean;
  isError: boolean;
};
export function Main({ albums, users, photos, isFetching, isError }: Props) {
  const [filterText, setFilterText] = useState<string>("");

  const initialAlbums: ListAlbum[] = useMemo(() => {
    let result: ListAlbum[] = [];

    for (const album of albums) {
      for (const user of users) {
        if (album.userId === user.id) {
          result.push({
            albumId: album.id,
            name: album.title,
            userId: user.id,
            user: user.name,
            thumbnail:
              // We just need one of photos thumbnail.
              photos.find((el) => el.albumId === album.id)?.thumbnailUrl || "",
          });
        }
      }
    }

    return result;
  }, [albums, users, photos]);

  const filteredAlbum = useMemo(() => filterAlbums(initialAlbums, filterText), [
    initialAlbums,
    filterText,
  ]);

  const onFilterByAlbumName = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value.toLowerCase());
  };

  if (isError) {
    <Error />;
  }

  return (
    <div className="main">
      <input
        className="filter"
        type="text"
        placeholder="Filter by Album Name or by User Name"
        onChange={onFilterByAlbumName}
      />

      {isFetching ? (
        <div>Fetching data...</div>
      ) : (
        <ul>
          {filteredAlbum.map((album, idx) => (
            <li key={idx}>
              <img src={album.thumbnail} alt={album.name} />

              <div className="info">
                <div className="person">
                  <img src={personIcon} alt="person-icon" />
                  <Link to={`/users/${album.userId}`}>{album.user}</Link>
                </div>

                <div className="album">
                  <img src={albumIcon} alt="album-icon" />
                  <Link to={`/albums/${album.albumId}?user=${album.user}`}>
                    {album.name}
                  </Link>
                  <span className="tooltip">{album.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Helper.
const filterAlbums = (albums: ListAlbum[], filterText: string = "") => {
  return albums.filter((el) => {
    return (
      el.name.toLowerCase().includes(filterText) ||
      el.user.toLowerCase().includes(filterText)
    );
  });
};
