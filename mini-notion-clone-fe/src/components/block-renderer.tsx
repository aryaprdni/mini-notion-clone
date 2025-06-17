import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  TextField,
  IconButton,
  Stack,
  Button,
  Box,
  Checkbox,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CodeIcon from "@mui/icons-material/Code";
import TextEditor from "./text-editor";
import type { Block } from "../types/blocks-types";

export default function BlockRenderer({
  block,
  onChange,
  onDelete,
}: {
  block: Block;
  onChange: (newContent: string, file?: File) => void;
  onDelete: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [codeValue, setCodeValue] = useState(
    block.type === "code" ? block.content : ""
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      onChange(value);
    }, 500),
    [onChange]
  );

  useEffect(() => () => debouncedOnChange.cancel(), [debouncedOnChange]);

  useEffect(() => {
    if (block.type === "code") {
      setCodeValue(block.content);
    }
  }, [block]);

  if (block.type === "text") {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Box sx={{ flexGrow: 1 }}>
            <TextEditor
              content={block.content}
              onChange={(newContent) => debouncedOnChange(newContent)}
            />
          </Box>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Paper>
    );
  }

  if (block.type === "checklist") {
    const contentStr = String(block.content);
    const isChecked = contentStr.startsWith("[x]");
    const rawContent = contentStr.replace(/^\[.\]\s?/, "");

    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Checkbox
            checked={isChecked}
            onChange={(e) => {
              const newContent = `${e.target.checked ? "[x]" : "[ ]"} ${rawContent}`;
              onChange(newContent);
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            defaultValue={rawContent}
            onChange={(e) => {
              const newContent = `${isChecked ? "[x]" : "[ ]"} ${e.target.value}`;
              debouncedOnChange(newContent);
            }}
          />
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Paper>
    );
  }

  if (block.type === "image") {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <img
            src={
              String(block.content) === "New image block"
                ? "https://http.cat/404"
                : `http://localhost:3001${block.content}`
            }
            alt="Uploaded"
            style={{
              maxWidth: "200px",
              maxHeight: "150px",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange("", file);
              }
            }}
          />
          <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
            Change
          </Button>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Paper>
    );
  }

  if (block.type === "code") {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            value={codeValue}
            onChange={(e) => {
              const newVal = e.target.value;
              setCodeValue(newVal);
              debouncedOnChange(newVal);
            }}
            InputProps={{
              startAdornment: <CodeIcon sx={{ mr: 1 }} />,
              sx: { fontFamily: "monospace" },
            }}
          />
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Paper>
    );
  }

  return null;
}
