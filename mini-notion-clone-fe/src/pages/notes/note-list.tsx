import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Button, Stack, Card, CardContent, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createNote, deleteNote, getNotes } from "./api";
import type { Note } from "../../types/note-types";

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  const handleCreate = async () => {
    const newNote = await createNote("Untitled Note");
    navigate(`/notes/${newNote.id}`);
  };

  const handleDelete = async (id: number) => {
    await deleteNote(id);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">My Notes</Typography>
        <Button variant="contained" onClick={handleCreate}>New Note</Button>
      </Stack>
      <Stack spacing={2}>
        {notes.map((note) => (
          <Card key={note.id} sx={{ cursor: "pointer" }} onClick={() => navigate(`/notes/${note.id}`)}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography>{note.title}</Typography>
              <IconButton onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
