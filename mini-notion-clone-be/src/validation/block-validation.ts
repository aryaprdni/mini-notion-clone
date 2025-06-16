import { z, ZodType } from "zod";
import { BlockType } from "@prisma/client";

export class BlockValidation {
    static readonly CREATE: ZodType = z.object({
        type: z.nativeEnum(BlockType),
        content: z.string().min(1),
        parentId: z.number().nullable().optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        content: z.string().min(1),
    });
}
