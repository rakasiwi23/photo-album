import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import { Album, User } from "../common/types";
import { Error } from "../components/Error";
import "../assets/styles/user-info.css";
import personIcon from "../assets/images/person-icon.svg";
import emailIcon from "../assets/images/email-icon.svg";
import siteIcon from "../assets/images/site-icon.svg";

type Props = {
  users: User[];
  albums: Album[];
  isFetching: boolean;
  isError: boolean;
};
export function UserInfo({ albums, users, isFetching, isError }: Props) {
  const { userId } = useParams<{ userId: string }>();

  const matchedUser = useMemo(
    () => users.find((user) => user.id === Number(userId)),
    [users, userId],
  );

  const filteredAlbums = useMemo(
    () => albums.filter((album) => album.userId === Number(userId)),
    [albums, userId],
  );

  if (isError) {
    return <Error />;
  }

  return (
    <div className="user-info">
      <div className="title-page">User</div>

      {isFetching ? (
        <div className="fetching">Getting data...</div>
      ) : (
        <>
          <div className="info-wrapper">
            <div>
              <img src={personIcon} alt="person-icon" /> {matchedUser?.name}
            </div>
            <div>
              <img src={emailIcon} alt="email-icon" /> {matchedUser?.email}
            </div>
            <div>
              <img src={siteIcon} alt="site-icon" /> {matchedUser?.website}
            </div>
          </div>
          <ul>
            <li className="title">Albums: </li>
            {filteredAlbums.map((album) => (
              <li>
                <Link to={`/albums/${album.id}?user=${matchedUser?.name}`}>
                  {album.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
