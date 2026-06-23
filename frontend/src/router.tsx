import { createBrowserRouter } from "react-router-dom";

import { Provider } from "./provider";
import LoginPage from "./pages/LoginPage";

import HomePage from "@/pages/HomePage";
import NotesPage from "@/pages/NotesPage";
import SearchPage from "@/pages/SearchPage";
import FolderPage from "@/pages/FolderPage";
import ProfilePage from "@/pages/ProfilePage";
import NoteDetailsPage from "@/pages/NoteDetailsPage";
import ResponsiveLayout from "@/app/layouts/ResponsiveLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ResponsiveLayout />,
    children: [
      {
        path: "/login",
        element: (
          <Provider>
            <LoginPage />
          </Provider>
        ),
      },
      {
        index: true,
        element: (
          <Provider>
            <HomePage />,
          </Provider>
        ),
      },
      {
        path: "notes",
        element: (
          <Provider>
            <NotesPage />,
          </Provider>
        ),
      },
      {
        path: "search",
        element: (
          <Provider>
            <SearchPage />,
          </Provider>
        ),
      },
      {
        path: "folders",
        element: (
          <Provider>
            <FolderPage />,
          </Provider>
        ),
      },
      {
        path: "profile",
        element: (
          <Provider>
            <ProfilePage />,
          </Provider>
        ),
      },
      {
        path: "notes/:id",
        element: (
          <Provider>
            <NoteDetailsPage />,
          </Provider>
        ),
      },
    ],
  },
]);
