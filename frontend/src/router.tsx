import { createBrowserRouter, Outlet } from "react-router-dom";

import { Provider } from "./provider";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NoteDetailsPage from "./pages/NoteDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import CreateNotesPage from "./pages/CreateNotePage";
import NotesPage from "./pages/NotesPage";

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
        path: "/login",
        element: <LoginPage />,
      },

      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/notes", element: <NotesPage /> },
          { path: "/notes/:id", element: <NoteDetailsPage /> },
          { path: "/create", element: <CreateNotesPage /> },
          { path: "/search", element: <SearchPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
