import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Stack,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getNoteById, updateNoteTitle } from "./api";
import {
  createBlock,
  getBlocksByNote,
  updateBlock,
  deleteBlock,
  updateBlockOrders,
} from "../blocks/api";
import BlockRenderer from "../components/block-renderer";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block } from "../../types/blocks-types";

function SortableItem({
  block,
  onChange,
  onDelete,
}: {
  block: Block;
  onChange: (newContent: string, file?: File) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BlockRenderer block={block} onChange={onChange} onDelete={onDelete} />
    </div>
  );
}

export default function NoteEditor() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);

  const fetchNote = async () => {
    if (!noteId) return;
    const noteData = await getNoteById(noteId);
    setTitle(noteData.data.title);
  };

  const fetchBlocks = async () => {
    if (!noteId) return;
    const data = await getBlocksByNote(noteId);
    setBlocks(data.sort((a, b) => a.order_index - b.order_index));
  };

  const handleSave = async () => {
    if (!noteId) return;
    await updateNoteTitle(noteId, title);
    navigate("/notes");
  };

  const handleAddTextBlock = async () => {
    if (!noteId) return;
    const newBlock = await createBlock(noteId, "text", "New text block");
    setBlocks((prev) => [...prev, newBlock]);
  };


  const handleUpdateBlock = async (
    blockId: number,
    content?: string,
    file?: File
  ) => {
    const updated = await updateBlock(blockId, content, file);
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, content: updated.content, type: updated.type } : b
      )
    );
  };

  const handleDeleteBlock = async (blockId: number) => {
    await deleteBlock(blockId);
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const newBlocks = arrayMove(blocks, oldIndex, newIndex);

    setBlocks(newBlocks);

    const reordered = newBlocks.map((block, index) => ({
      id: block.id,
      order: index,
    }));
    await updateBlockOrders(reordered);
  };

  useEffect(() => {
    fetchNote();
    fetchBlocks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate("/notes")}>
          <ArrowBackIcon />
        </IconButton>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          variant="standard"
          placeholder="Note Title"
        />
        <Button variant="outlined" onClick={handleSave}>
          Save
        </Button>
      </Stack>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={2}>
            {blocks.map((block) => (
              <SortableItem
                key={block.id}
                block={block}
                onChange={(newContent, file) =>
                  handleUpdateBlock(block.id, newContent, file)
                }
                onDelete={() => handleDeleteBlock(block.id)}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" onClick={handleAddTextBlock}>
          + Add Text Block
        </Button>
      </Stack>
    </Container>
  );
}
