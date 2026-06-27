import { createBrowserRouter, Outlet } from "react-router-dom";

import { Provider } from "./provider";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import NoteDetailsPage from "./pages/NoteDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import CreateNotesPage from "./pages/CreateNotePage";
import NotesPage from "./pages/NotesPage";
import FavoritesPage from "./pages/FavoritesPage";
import ArchivePage from "./pages/ArchivePage";
import TagsPage from "./pages/TagsPage";

import ResponsiveLayout from "@/app/layouts/ResponsiveLayout";

const RootLayout = () => (
  <Provider>
    <Outlet />
  </Provider>
);

const AppLayout = () => (
  <ProtectedRoute>
    <ResponsiveLayout />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/auth/login",
        element: <AuthPage mode="login" />,
      },
      {
        path: "/auth/signup",
        element: <AuthPage mode="signup" />,
      },

      {
        element: <AppLayout />,
        children: [
          { path: "/notes", element: <NotesPage /> },
          { path: "/notes/:id", element: <NoteDetailsPage /> },
          { path: "/create", element: <CreateNotesPage /> },
          { path: "/favorites", element: <FavoritesPage /> },
          { path: "/archive", element: <ArchivePage /> },
          { path: "/tags", element: <TagsPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
