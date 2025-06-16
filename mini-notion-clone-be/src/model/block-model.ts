import { Block, BlockType } from "@prisma/client";

export interface CreateBlockRequest {
    type: BlockType;
    content: string;
    parentId?: number | null;
}

export interface UpdateBlockRequest {
    content?: string;
}

export interface BlockResponse {
    id: number;
    note_id: number;
    type: BlockType;
    content: string;
    order_index: number;
    parent_id: number | null;
    created_at: Date;
    updated_at: Date;
}

export function toBlockResponse(block: Block): BlockResponse {
    return {
        id: block.id,
        note_id: block.note_id,
        type: block.type,
        content: block.content,
        order_index: block.order_index,
        parent_id: block.parent_id,
        created_at: block.created_at,
        updated_at: block.updated_at,
    };
}
