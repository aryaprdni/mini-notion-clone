import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Box, Stack, IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { useEffect } from "react";
import type { BlockContent } from "../types/blocks-types";

export default function TextEditor({
  content,
  onChange,
}: {
  content: BlockContent;
  onChange: (newContent: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && String(content) !== editor.getHTML()) {
      editor.commands.setContent(String(content));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) return null;

  return (
    <Box border="1px solid #ccc" borderRadius={2} p={2}>
      <Stack direction="row" spacing={1} mb={1}>
        <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBoldIcon />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalicIcon />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FormatUnderlinedIcon />
        </IconButton>
      </Stack>
      <EditorContent editor={editor} />
    </Box>
  );
}
