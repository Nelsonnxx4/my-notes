import { createBrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import SingleNotePage from "./pages/SingleNotePage";
import CreateNotesPage from "./pages/CreateNotePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/create",
    element: (
      // <ProtectedRoute>
      <CreateNotesPage />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      // <ProtectedRoute>
      <HomePage />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SingleNotePage />
      </ProtectedRoute>
    ),
  },
]);
