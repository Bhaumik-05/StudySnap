import { Routes, Route } from "react-router-dom";

import AppShell from "./components/layout/AppShell";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import Notes from "./pages/notes/Notes";
import NoteDetails from "./pages/notes/NoteDetails";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Departments from "./pages/departments/Departments";

import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Upload from "./pages/dashboard/Upload";
import UploadHistory from "./pages/dashboard/UploadHistory";
import DownloadHistory from "./pages/dashboard/DownloadHistory";
import TaggedNotes from "./pages/dashboard/TaggedNotes";

import Admin from "./pages/admin/Admin";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import { ROLES } from "./lib/constants";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />

        <Route path="/departments" element={<Departments />} />

        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:noteId" element={<NoteDetails />} />

        {/* Guest-only: an authenticated user is redirected to /dashboard */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Authenticated (any role) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/download-history" element={<DownloadHistory />} />
        </Route>

        {/* Authenticated, STUDENT or FACULTY only (matches roleMiddleware on the server) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.FACULTY]} />}>
          <Route path="/upload" element={<Upload />} />
          <Route path="/uploads" element={<UploadHistory />} />
          <Route path="/tagged" element={<TaggedNotes />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
