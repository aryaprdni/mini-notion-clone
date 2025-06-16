import { prismaClient } from "../../prisma/client";
import { CreateNoteRequest, NoteResponse, toNoteResponse, UpdateNoteRequest } from "../model/note-model";
import { Validation } from "../validation/validation";
import { NoteValidation } from "../validation/note-validation";
import { ResponseError } from "../error/response-error";
import { User } from "@prisma/client";

export class NoteService {
    static async create(user: User, request: CreateNoteRequest): Promise<NoteResponse> {
        const data = Validation.validate(NoteValidation.CREATE, request);

        const note = await prismaClient.note.create({
            data: {
                user_id: user.id,
                title: data.title,
            },
        });

        return toNoteResponse(note);
    }

    static async get(user: User): Promise<NoteResponse[]> {
        const notes = await prismaClient.note.findMany({
            where: { user_id: user.id },
            orderBy: { updated_at: "desc" },
        });

        return notes.map(toNoteResponse);
    }

    static async getById(user: User, noteId: number): Promise<NoteResponse> {
        const note = await prismaClient.note.findFirst({
            where: { id: noteId, user_id: user.id },
        });

        if (!note) throw new ResponseError(404, "Note not found");

        return toNoteResponse(note);
    }

    static async update(user: User, noteId: number, request: UpdateNoteRequest): Promise<NoteResponse> {
        const data = Validation.validate(NoteValidation.UPDATE, request);

        const updated = await prismaClient.note.updateMany({
            where: { id: noteId, user_id: user.id },
            data: { title: data.title },
        });

        if (updated.count === 0) throw new ResponseError(404, "Note not found");

        const note = await prismaClient.note.findFirst({ where: { id: noteId } });
        return toNoteResponse(note!);
    }

    static async remove(user: User, noteId: number): Promise<void> {
        await prismaClient.block.deleteMany({ where: { note_id: noteId } });
        await prismaClient.note.deleteMany({ where: { id: noteId, user_id: user.id } });
    }
}