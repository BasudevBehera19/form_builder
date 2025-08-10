import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { RootState } from "../store";
import {
  addField,
  updateField,
  removeField,
  moveFieldUp,
  moveFieldDown,
  setFields,
  reset
} from "../store/formSlice";
import FieldEditor from "../components/FieldEditor";
import FieldList from "../components/FieldList";
import { v4 as uuid } from "uuid";
import {
  saveFormSchema,
  updateFormSchema,
  loadFormById
} from "../utils/localStorage";
import { FormSchema } from "../store/types";
import { useParams } from "react-router-dom";

export default function Create() {
  const { id: editId } = useParams();
  const fields = useSelector((s: RootState) => s.formBuilder.fields);
  const dispatch = useDispatch();

  const [showSave, setShowSave] = useState(false);
  const [formName, setFormName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (editId) {
      const schema = loadFormById(editId);
      if (schema) {
        dispatch(setFields(schema.fields));
        setFormName(schema.name);
        setSelectedId(schema.fields[0]?.id || null); // select first field
      }
    } else {
      dispatch(reset());
      setSelectedId(null);
    }
  }, [editId, dispatch]);

  function handleAdd(type?: any) {
    const id = uuid();
    dispatch(addField({ id, type: type || "text", label: "New field" }));
    setSelectedId(id); // auto-select newly added field
  }

  function handleSave() {
    if (!formName.trim()) {
      alert("Please provide form name");
      return;
    }
    const schema: FormSchema = {
      id: editId || uuid(),
      name: formName,
      createdAt: editId
        ? loadFormById(editId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      fields,
    };

    if (editId) {
      updateFormSchema(schema);
      alert("Form updated in localStorage");
    } else {
      saveFormSchema(schema);
      alert("Form saved to localStorage");
    }
    setShowSave(false);
  }

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6">Add new field</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => handleAdd("text")}>Text</Button>
            <Button variant="contained" onClick={() => handleAdd("number")}>Number</Button>
            <Button variant="contained" onClick={() => handleAdd("textarea")}>Textarea</Button>
            <Button variant="contained" onClick={() => handleAdd("select")}>Select</Button>
            <Button variant="contained" onClick={() => handleAdd("radio")}>Radio</Button>
            <Button variant="contained" onClick={() => handleAdd("checkbox")}>Checkbox</Button>
            <Button variant="contained" onClick={() => handleAdd("date")}>Date</Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Field list</Typography>
          <FieldList
            fields={fields}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
            onRemove={(id) => dispatch(removeField(id))}
            onMoveUp={(id) => dispatch(moveFieldUp(id))}
            onMoveDown={(id) => dispatch(moveFieldDown(id))}
            onUpdate={(id, patch) => dispatch(updateField({ id, patch }))}
          />
        </Paper>

        <Paper sx={{ p: 2, width: 420 }}>
          <Typography variant="h6">Selected Field Editor</Typography>
          <FieldEditor selectedId={selectedId} />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Actions</Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Button onClick={() => setShowSave(true)} variant="contained">
              {editId ? "Update Form" : "Save Form"}
            </Button>
            <Button variant="outlined" href="/preview">
              Open Preview
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <Dialog open={showSave} onClose={() => setShowSave(false)}>
        <DialogTitle>{editId ? "Update form" : "Save form"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Form name"
            fullWidth
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSave(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editId ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
