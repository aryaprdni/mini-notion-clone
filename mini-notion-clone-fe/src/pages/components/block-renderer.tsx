/* eslint-disable react-hooks/exhaustive-deps */
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef } from "react";
import {
  TextField,
  IconButton,
  Stack,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Block } from "../../types/blocks-types";

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

  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      onChange(value);
    }, 500),
    [onChange]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  switch (block.type) {
    case "text":
      return (
        <Stack direction="row" alignItems="start" spacing={1}>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            defaultValue={block.content}
            onChange={(e) => debouncedOnChange(e.target.value)}
          />
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
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
      <Button onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
        </Stack>
      );

    case "image":
      return (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box>
              <img
                src={`http://localhost:3001${block.content}`} alt="Uploaded"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </Box>
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
            <Button onClick={() => fileInputRef.current?.click()}>Change</Button>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Box>
      );

    default:
      return null;
  }
}
