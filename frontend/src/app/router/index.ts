// app/router/index.tsx

import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import NotesPage from "@/pages/NotesPage";
import SearchPage from "@/pages/SearchPage";
import FolderPage from "@/pages/FolderPage";
import ProfilePage from "@/pages/ProfilePage";

import MobileLayout from "../layouts/MobileLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "notes",
        element: <NotesPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "folders",
        element: <FolderPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);