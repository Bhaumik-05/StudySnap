import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Notes from "./pages/notes/Notes";
import NoteDetails from "./pages/notes/NoteDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/notes" element={<Notes />} />

      <Route path="/notes/:noteId" element={<NoteDetails />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;