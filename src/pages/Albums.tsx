import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

import { Photo, User, PhotoComment } from "../common/types";
import { Error } from "../components/Error";
import "../assets/styles/albums.css";
import emailIcon from "../assets/images/email-icon.svg";

type Props = {
  photos: Photo[];
  commentedPhotos: PhotoComment[];
  users: User[];
  isFetching: boolean;
  isError: boolean;
  onSetFavoritePhoto: (photoId: number) => void;
  onAddComment: (photoId: number, comment: string) => void;
};
export function Albums({
  photos,
  commentedPhotos,
  users,
  isFetching,
  isError,
  onSetFavoritePhoto,
  onAddComment,
}: Props) {
  const { albumId } = useParams<{ albumId: string }>();
  const username = useQuery().get("user");

  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setComment(value);
  };

  const filteredPhotos: Photo[] = useMemo(
    () => photos.filter((photo) => photo.albumId === Number(albumId)),
    [albumId, photos],
  );

  const matchedUser: User = useMemo(
    () => users.find((user) => user.name === username)!,
    [users, username],
  );

  const renderComments = (photo: Photo) => {
    let comments = [];

    for (const photoWithComment of commentedPhotos) {
      if (photo.id === photoWithComment.photoId) {
        for (const [idx, comment] of photoWithComment.comments.entries()) {
          comments.push(
            <div className="comment" key={idx}>
              {comment}
            </div>,
          );
        }
      }
    }

    return comments;
  };

  if (isError) {
    return <Error />;
  }

  return (
    <div className="albums">
      <div className="title-page">Album</div>

      {isFetching ? (
        <div className="fetching">Getting data...</div>
      ) : (
        <>
          <div className="info-wrapper">
            <div>
              Photos by:
              <Link to={`/users/${matchedUser.id}`}>{matchedUser.name}</Link>
            </div>
            <div>
              <img src={emailIcon} alt="email-icon" /> {matchedUser.email}
            </div>
          </div>
          <ul>
            {filteredPhotos.map((photo, idx) => (
              <li key={idx}>
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.thumbnailUrl}
                  onClick={() => onSetFavoritePhoto(photo.id)}
                />
                <div className="add-favorite">Favorite</div>

                <div className="title">{photo.title}</div>
                {photo.isFavorite ? (
                  <span className="favorite">Favorite</span>
                ) : (
                  ""
                )}

                <div className="comment-wrapper">
                  <div className="title">Comments:</div>
                  {renderComments(photo)}
                </div>

                <textarea
                  name="comment"
                  id="comment"
                  cols={30}
                  rows={3}
                  onChange={onChange}
                />
                <button onClick={() => onAddComment(photo.id, comment)}>
                  Add Comment
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// Helper.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
