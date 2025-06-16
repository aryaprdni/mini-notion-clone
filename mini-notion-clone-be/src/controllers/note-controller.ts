import { Request, Response, NextFunction } from "express";
import { NoteService } from "../services/note-service";
import { CreateNoteRequest, UpdateNoteRequest } from "../model/note-model";
import { UserRequest } from "../type/user-request";

export class NoteController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateNoteRequest = req.body;
            const response = await NoteService.create(req.user!, request);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await NoteService.get(req.user!);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async getById(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const noteId = Number(req.params.id);
            const response = await NoteService.getById(req.user!, noteId);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const noteId = Number(req.params.id);
            const request: UpdateNoteRequest = req.body;
            const response = await NoteService.update(req.user!, noteId, request);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const noteId = Number(req.params.id);
            await NoteService.remove(req.user!, noteId);
            res.status(200).json({ message: "Note deleted" });
        } catch (e) {
            next(e);
        }
    }
}