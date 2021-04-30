import { useMemo, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { Album, User, Photo } from "../common/types";
import "../assets/styles/main.css";

type ListAlbum = {
  albumId: number;
  name: string;
  user: string;
  thumbnail: string;
};

type MainProps = {
  albums: Album[];
  users: User[];
  photos: Photo[];
  isFetching: boolean;
  isError: boolean;
};
export function Main({
  albums,
  users,
  photos,
  isFetching,
  isError,
}: MainProps) {
  const [filterText, setFilterText] = useState<string>("");

  const initialAlbums: ListAlbum[] = useMemo(() => {
    let result: ListAlbum[] = [];

    for (const album of albums) {
      for (const user of users) {
        if (album.userId === user.id) {
          result.push({
            albumId: album.id,
            name: album.title,
            user: user.name,
            thumbnail:
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
    return <div>Something went wrong!</div>;
  }

  return (
    <div className="main">
      <div>
        <input
          type="text"
          placeholder="Filter by Album Name or by User Name"
          onChange={onFilterByAlbumName}
        />
      </div>

      {isFetching ? (
        <div>Fetching data...</div>
      ) : (
        <ul>
          {filteredAlbum.map((album, idx) => (
            <li key={idx}>
              <img src={album.thumbnail} alt={album.name} />
              <Link
                to={`/albums/${album.name}?id=${album.albumId}&user=${album.user}`}
              >
                Album Name:
                <br /> {album.name}
              </Link>
              <a href={`/users/${album.user}`}>
                User Name:
                <br /> {album.user}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const filterAlbums = (albums: ListAlbum[], filterText: string = "") => {
  return albums.filter((el) => {
    return (
      el.name.toLowerCase().includes(filterText) ||
      el.user.toLowerCase().includes(filterText)
    );
  });
};
