import { createBrowserRouter, Outlet } from "react-router-dom";

import { Provider } from "./provider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import NoteDetailsPage from "./pages/NoteDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import CreateNotesPage from "./pages/CreateNotePage";
import NotesPage from "./pages/NotesPage";

const RootLayout = () => (
  <Provider>
    <Outlet />
  </Provider>
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
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <CreateNotesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes",
        element: (
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes/:id",
        element: (
          <ProtectedRoute>
            <NoteDetailsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
