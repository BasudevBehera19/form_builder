import React, { useEffect, useState } from "react";
import { loadAllForms } from "../utils/localStorage";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MyForms() {
  const [forms, setForms] = useState(() => loadAllForms());
  const nav = useNavigate();

  useEffect(() => {
    setForms(loadAllForms());
  }, []);

  function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    const updated = forms.filter((f) => f.id !== id);
    localStorage.setItem("forms_Data", JSON.stringify(updated));
    setForms(updated);
  }

  return (
    <div>
      <Typography variant="h6">My Forms</Typography>
      <List>
        {forms.map((f) => (
          <ListItem
            key={f.id}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <Button onClick={() => nav(`/preview/${f.id}`)}>
                  Open Preview
                </Button>
                <Button
                  onClick={() => nav(`/create/${f.id}`)}
                  color="secondary"
                  variant="outlined"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(f.id)}
                  color="error"
                  variant="outlined"
                >
                  Delete
                </Button>
              </Stack>
            }
          >
            <ListItemText
              primary={f.name}
              secondary={new Date(f.createdAt).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
      {forms.length === 0 && <Typography>No saved forms yet.</Typography>}
    </div>
  );
}
