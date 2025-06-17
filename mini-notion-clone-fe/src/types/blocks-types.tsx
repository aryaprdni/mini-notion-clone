export type BlockType = "text" | "image" | "code" | "checklist";

export type TextContent = { text: string };
export type ImageContent = { url: string };

export type BlockContent = TextContent | ImageContent;

export interface Block {
  id: number;
  note_id: number;
  parent_id: number | null;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  created_at: string;
  updated_at: string;
}
