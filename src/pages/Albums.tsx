import { useMemo, useState, ChangeEvent } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

import { Photo, User, PhotoComment } from "../common/types";
import { Error } from "../components/Error";

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
          comments.push(<div key={idx}>{comment}</div>);
        }
      }
    }

    return comments;
  };

  if (isError) {
    <Error />;
  }

  return (
    <div className="albums">
      {isFetching ? (
        <div>Fetching...</div>
      ) : (
        <>
          <div>
            Photos by:{" "}
            <Link to={`/users/${matchedUser.id}`}>{matchedUser.name}</Link>
            <br />
            Email: {matchedUser.email}
          </div>
          <ul>
            {filteredPhotos.map((photo, idx) => (
              <li key={idx}>
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.thumbnailUrl}
                  onClick={() => onSetFavoritePhoto(photo.id)}
                />
                <div>{photo.title}</div>
                {photo.isFavorite ? "Favorite" : "Not Favorite"}

                {renderComments(photo)}

                <textarea
                  name="comment"
                  id="comment"
                  cols={30}
                  rows={10}
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
