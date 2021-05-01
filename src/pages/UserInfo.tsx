import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import { Album, User } from "../common/types";

type Props = {
  users: User[];
  albums: Album[];
};
export function UserInfo({ albums, users }: Props) {
  const { userId } = useParams<{ userId: string }>();

  const matchedUser = useMemo(
    () => users.find((user) => user.id === Number(userId)),
    [users, userId],
  );

  const filteredAlbums = useMemo(
    () => albums.filter((album) => album.userId === Number(userId)),
    [albums, userId],
  );

  return (
    <div className="user-info">
      <div>Name: {matchedUser?.name}</div>
      <div>Email: {matchedUser?.email}</div>
      <div>Website: {matchedUser?.website}</div>

      <ul>
        {filteredAlbums.map((album) => (
          <li>
            <Link to={`/albums/${album.id}?user=${matchedUser?.name}`}>
              {album.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
