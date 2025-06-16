import { z, ZodType } from "zod";

export class NoteValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(255),
    });

    static readonly UPDATE: ZodType = z.object({
        title: z.string().min(1).max(255),
    });
}