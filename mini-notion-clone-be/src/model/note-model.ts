import { Note } from "@prisma/client";

export interface CreateNoteRequest {
    title: string;
}

export interface UpdateNoteRequest {
    title: string;
}

export interface NoteResponse {
    id: number;
    title: string;
    created_at: Date;
    updated_at: Date;
}

export function toNoteResponse(note: Note): NoteResponse {
    return {
        id: note.id,
        title: note.title,
        created_at: note.created_at,
        updated_at: note.updated_at,
    };
}