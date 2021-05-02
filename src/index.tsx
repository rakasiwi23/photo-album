import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { useQueries } from "react-query";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { httpRequest } from "./utils";
import { Album, User, Photo, PhotoComment } from "./common/types";
import { Main } from "./pages/Main";
import { Albums } from "./pages/Albums";
import { UserInfo } from "./pages/UserInfo";
import { FavoritePhotos } from "./pages/FavoritePhotos";

import "./assets/styles/index.css";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient();

function Index() {
  const [albumsRes, usersRes, photosRes] = useQueries([
    {
      queryKey: "albums",
      queryFn: () => httpRequest("albums"),
      refetchOnWindowFocus: false,
      initialData: [],
    },
    {
      queryKey: "users",
      queryFn: () => httpRequest("users"),
      refetchOnWindowFocus: false,
      initialData: [],
    },
    {
      queryKey: "photos",
      queryFn: async () => {
        const photos = await httpRequest("photos");
        return (photos as Photo[]).map((photo) => ({
          ...photo,
          // Initialize all photo 'favorite' property value to 'false'.
          isFavorite: false,
        }));
      },
      refetchOnWindowFocus: false,
      initialData: [],
    },
  ]);
  const [favoritePhotos, setFavoritePhotos] = useState<number[]>([]);
  const [commentedPhotos, setCommentedPhotos] = useState<PhotoComment[]>([]);

  const photos: Photo[] = useMemo(() => {
    const finalPhotos: Photo[] = [...(photosRes.data as Photo[])];

    for (const photoId of favoritePhotos) {
      const index = finalPhotos.findIndex((photo) => photo.id === photoId);
      if (index > -1) {
        finalPhotos.splice(index, 1, {
          ...finalPhotos[index],
          isFavorite: !finalPhotos[index].isFavorite,
        });
      }
    }

    return finalPhotos;
  }, [photosRes.data, favoritePhotos]);

  const onSetFavoritePhoto = (photoId: number) => {
    setFavoritePhotos((prev) => {
      const newFavoritedPhotos = [...prev];
      const index = newFavoritedPhotos.findIndex((el) => el === photoId);

      if (index > -1) {
        newFavoritedPhotos.splice(index, 1);
      } else {
        newFavoritedPhotos.push(photoId);
      }

      return newFavoritedPhotos;
    });
  };

  const onAddComment = (photoId: number, comment: string) => {
    setCommentedPhotos((prev) => {
      const newCommentedPhotos = [...prev];
      const index = newCommentedPhotos.findIndex(
        (el) => el.photoId === photoId,
      );

      if (index > -1) {
        newCommentedPhotos[index].comments.push(comment);
      } else {
        newCommentedPhotos.push({
          photoId,
          comments: [comment],
        });
      }

      return newCommentedPhotos;
    });
  };

  const isError =
    albumsRes.status === "error" ||
    usersRes.status === "error" ||
    photosRes.status === "error";

  const isFetching =
    albumsRes.isFetching || usersRes.isFetching || photosRes.isFetching;

  return (
    <Router>
      <nav>
        <NavLink exact to="/">
          Home
        </NavLink>
        <NavLink exact to="/favorite-photos">
          My Favorite Photos
        </NavLink>
      </nav>

      <Switch>
        <Route exact path="/">
          <Main
            albums={albumsRes.data as Album[]}
            users={usersRes.data as User[]}
            photos={photos}
            isFetching={isFetching}
            isError={isError}
          />
        </Route>
        <Route exact path="/albums/:albumId">
          <Albums
            photos={photos}
            commentedPhotos={commentedPhotos}
            users={usersRes.data as User[]}
            isFetching={isFetching}
            isError={isError}
            onSetFavoritePhoto={onSetFavoritePhoto}
            onAddComment={onAddComment}
          />
        </Route>
        <Route exact path="/users/:userId">
          <UserInfo
            users={usersRes.data as User[]}
            albums={albumsRes.data as Album[]}
            isFetching={isFetching}
            isError={isError}
          />
        </Route>
        <Route exact path="/favorite-photos">
          <FavoritePhotos albums={albumsRes.data as Album[]} photos={photos} />
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Index />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
