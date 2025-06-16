import api from "../../api/axios";
import type { Note } from "../../types/note-types";

export const getNotes = async (): Promise<Note[]> => {
  const res = await api.get("/notes");
  return res.data.data;
};

export const getNoteById = async (noteId: string) => {
  const res = await api.get(`/notes/${noteId}`);
  return res.data;
};

export const createNote = async (title: string) => {
  const res = await api.post("/notes", { title });
  return res.data.data;
};

export const updateNoteTitle = async (noteId: string, title: string) => {
  await api.put(`/notes/${noteId}`, { title });
};

export async function deleteNote(noteId: number): Promise<void> {
  await api.delete(`/notes/${noteId}`);
}

export const deleteBlock = async (blockId: number) => {
  await api.delete(`/blocks/${blockId}`);
};

