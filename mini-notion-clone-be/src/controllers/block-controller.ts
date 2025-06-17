import { Request, Response, NextFunction } from "express";
import { BlockService } from "../services/block-service";
import { CreateBlockRequest, UpdateBlockRequest } from "../model/block-model";
import { UserRequest } from "../type/user-request";

export class BlockController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const noteId = Number(req.params.noteId);
            const request: CreateBlockRequest = req.body;
            const response = await BlockService.create(req.user!, noteId, request);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const noteId = Number(req.params.noteId);
            const response = await BlockService.get(req.user!, noteId);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const blockId = Number(req.params.id);
            const request: UpdateBlockRequest = req.body;
            const file = req.file;
            const response = await BlockService.update(req.user!, blockId, request, file);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }


    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const blockId = Number(req.params.id);
            await BlockService.remove(req.user!, blockId);
            res.status(200).json({ message: "Block deleted" });
        } catch (e) {
            next(e);
        }
    }

    static async updateBlockOrders(req: UserRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            const blocks: { id: number; order: number }[] = req.body;
            console.log('Received blocks:', blocks);
            if (!Array.isArray(blocks)) {
                return res.status(400).json({ message: "Invalid payload format" });
            }

            await BlockService.updateOrders(blocks);
            res.status(200).json({ message: "Block orders updated" });
        } catch (error) {
            next(error);
        }
    }
}
