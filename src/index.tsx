import React from "react";
import ReactDOM from "react-dom";
import { useQueries } from "react-query";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { httpRequest } from "./utils/api";
import { Album, User, Photo } from "./common/types";
import { Main } from "./pages/Main";
import "./assets/styles/index.css";
import reportWebVitals from "./reportWebVitals";
import { Albums } from "./pages/Albums";

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
      queryFn: () => httpRequest("photos"),
      refetchOnWindowFocus: false,
      initialData: [],
    },
  ]);

  const isError =
    albumsRes.status === "error" ||
    usersRes.status === "error" ||
    photosRes.status === "error";

  const isFetching =
    albumsRes.isFetching || usersRes.isFetching || photosRes.isFetching;

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Main
            albums={albumsRes.data as Album[]}
            users={usersRes.data as User[]}
            photos={photosRes.data as Photo[]}
            isFetching={isFetching}
            isError={isError}
          />
        </Route>
        <Route exact path="/albums/:album">
          <Albums />
        </Route>
        <Route exact path="/users/:user">
          <div>Users goes here...</div>
        </Route>
        <Route exact path="/photos/:photo">
          <div>Photos goes here...</div>
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
