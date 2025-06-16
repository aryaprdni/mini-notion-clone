import api from "../../api/axios";
import type { Block } from "../../types/blocks-types";

export const getBlocksByNote = async (noteId: string): Promise<Block[]> => {
    const res = await api.get(`/notes/${noteId}/blocks`);
    return res.data.data
};

export const createBlock = async (
    noteId: string,
    type: "text" | "image",
    content: string
) => {
    const payload = {
        type,
        content,
    };

    const res = await api.post(`/notes/${noteId}/blocks`, payload);

    return res.data.data;
};


export const updateBlock = async (
    blockId: number,
    content?: string,
    file?: File
): Promise<Block> => {
    const formData = new FormData();
    if (content) formData.append("content", content);
    if (file) formData.append("file", file);

    const res = await api.put(`/blocks/${blockId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data.data;
};

export const deleteBlock = async (blockId: number) => {
    await api.delete(`/blocks/${blockId}`);
};

export const updateBlockOrders = async (
    orders: { id: number; order: number }[]
): Promise<void> => {
    await api.patch("/blocks/order", orders);
};
