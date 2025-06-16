import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import NoteList from "./pages/notes/note-list";
import NoteEditor from "./pages/notes/note-editor";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={<NoteList />} />
        <Route path="/notes/new" element={<NoteEditor />} />
        <Route path="/notes/:noteId" element={<NoteEditor />} />
        </Routes>
    </Router>
  );
}