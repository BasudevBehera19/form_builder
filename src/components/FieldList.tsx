import React from "react";
import { Field } from "../store/types";
import { List, ListItem, ListItemText, IconButton, Stack, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface Props {
  fields: Field[];
  selectedId: string | null;
  onSelect: (id: string) => void; 
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Field>) => void;
}

export default function FieldList({
  fields,
  selectedId,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdate
}: Props) {
  return (
    <List>
      {fields.map((f) => (
        <ListItem
          key={f.id}
          button
          selected={f.id === selectedId} // highlight selected
          onClick={() => onSelect(f.id)} // change selection
          secondaryAction={
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => onMoveUp(f.id)} size="small">
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton onClick={() => onMoveDown(f.id)} size="small">
                <ArrowDownwardIcon />
              </IconButton>
              <IconButton onClick={() => onRemove(f.id)} size="small">
                <DeleteIcon />
              </IconButton>
            </Stack>
          }
        >
          <ListItemText
            primary={
              <span>
                {f.label}{" "}
                <Chip label={f.type} size="small" sx={{ ml: 1 }} />
              </span>
            }
            secondary={
              f.derived
                ? `Derived: ${f.derivedExpression}`
                : f.required
                ? "Required"
                : ""
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
