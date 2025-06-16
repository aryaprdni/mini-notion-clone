import { User } from "@prisma/client";
import { prismaClient } from "../../prisma/client";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { BlockResponse, CreateBlockRequest, toBlockResponse, UpdateBlockRequest } from "../model/block-model";
import { BlockValidation } from "../validation/block-validation";

export class BlockService {
    static async create(user: User, noteId: number, request: CreateBlockRequest): Promise<BlockResponse> {
        const data = Validation.validate(BlockValidation.CREATE, request);

        const note = await prismaClient.note.findFirst({
            where: { id: noteId, user_id: user.id },
        });

        if (!note) throw new ResponseError(404, "Note not found");

        const count = await prismaClient.block.count({
            where: { note_id: noteId, parent_id: data.parentId ?? null },
        });

        const block = await prismaClient.block.create({
            data: {
                note_id: noteId,
                type: data.type,
                content: data.content,
                order_index: count,
                parent_id: data.parentId ?? null,
            },
        });

        return toBlockResponse(block);
    }

    static async get(user: User, noteId: number): Promise<BlockResponse[]> {
        const note = await prismaClient.note.findFirst({
            where: { id: noteId, user_id: user.id },
        });

        if (!note) throw new ResponseError(404, "Note not found");

        const blocks = await prismaClient.block.findMany({
            where: { note_id: noteId },
            orderBy: { order_index: "asc" },
        });

        return blocks.map(toBlockResponse);
    }

    static async update(user: User, blockId: number, request: UpdateBlockRequest, file?: Express.Multer.File): Promise<BlockResponse> {
        const block = await prismaClient.block.findFirst({
            where: { id: blockId },
            include: { note: true },
        });

        if (!block || block.note.user_id !== user.id) {
            throw new ResponseError(404, "Block not found");
        }

        let newContent;
        let newType = block.type;

        if (file) {
            const fileUrl = `/uploads/${file.filename}`;
            newContent = fileUrl;
            newType = "image";
        } else if (block.type === "text") {
            if (!request.content) {
                throw new ResponseError(400, "Missing text content");
            }
            newContent = request.content;
        } else if (block.type === "image") {
            throw new ResponseError(400, "No image provided");
        } else {
            throw new ResponseError(400, "Unsupported block type");
        }

        const updated = await prismaClient.block.update({
            where: { id: blockId },
            data: {
                content: newContent,
                type: newType,
            },
        });

        return toBlockResponse(updated);
    }


    static async remove(user: User, blockId: number): Promise<void> {
        const block = await prismaClient.block.findFirst({
            where: { id: blockId },
            include: { note: true },
        });

        if (!block || block.note.user_id !== user.id) {
            throw new ResponseError(404, "Block not found");
        }

        await prismaClient.block.delete({ where: { id: blockId } });
    }

    static async updateOrders(blocks: { id: number; order: number }[]) {
        const transactions = blocks.map((block) =>
            prismaClient.block.update({
                where: { id: block.id },
                data: { order_index: block.order },
            })
        );
        await prismaClient.$transaction(transactions);
    }
}
