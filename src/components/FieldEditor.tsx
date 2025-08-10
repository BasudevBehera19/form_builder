import React, { useState } from "react";
import {
  TextField,
  Stack,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { updateField } from "../store/formSlice";
import DerivedFieldModal from "./DerivedFieldModal";
import { v4 as uuid } from "uuid";

interface Props {
  selectedId: string | null;
}

export default function FieldEditor({ selectedId }: Props) {
  const fields = useSelector((s: RootState) => s.formBuilder.fields);
  const dispatch = useDispatch();
  const [openDerived, setOpenDerived] = useState(false);

  const selected = fields.find((f) => f.id === selectedId) || null;

  function patch(patchObj: any) {
    if (!selected) return;
    dispatch(updateField({ id: selected.id, patch: patchObj }));
  }

  if (!selected) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography>
          No field selected. Add a field and click it in the list to edit.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <TextField
        label="Label"
        value={selected.label}
        onChange={(e) => patch({ label: e.target.value })}
      />
      <FormControlLabel
        control={
          <Switch
            checked={selected.required}
            onChange={(e) => patch({ required: e.target.checked })}
          />
        }
        label="Required"
      />
      <TextField
        label="Default value"
        value={selected.defaultValue || ""}
        onChange={(e) => patch({ defaultValue: e.target.value })}
      />

      <Box>
        <Typography variant="subtitle2">Validations</Typography>
        <Stack spacing={1} sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={!!selected.validations?.notEmpty}
                onChange={(e) =>
                  patch({
                    validations: {
                      ...selected.validations,
                      notEmpty: e.target.checked,
                    },
                  })
                }
              />
            }
            label="Not empty"
          />
          <TextField
            label="Min length"
            type="number"
            value={selected.validations?.minLength ?? ""}
            onChange={(e) =>
              patch({
                validations: {
                  ...selected.validations,
                  minLength: e.target.value ? Number(e.target.value) : null,
                },
              })
            }
          />
          <TextField
            label="Max length"
            type="number"
            value={selected.validations?.maxLength ?? ""}
            onChange={(e) =>
              patch({
                validations: {
                  ...selected.validations,
                  maxLength: e.target.value ? Number(e.target.value) : null,
                },
              })
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={!!selected.validations?.email}
                onChange={(e) =>
                  patch({
                    validations: {
                      ...selected.validations,
                      email: e.target.checked,
                    },
                  })
                }
              />
            }
            label="Email format"
          />
          <FormControlLabel
            control={
              <Switch
                checked={!!selected.validations?.passwordRule}
                onChange={(e) =>
                  patch({
                    validations: {
                      ...selected.validations,
                      passwordRule: e.target.checked,
                    },
                  })
                }
              />
            }
            label="Password rule (min 8 + number)"
          />
        </Stack>
      </Box>

      {(selected.type === "select" ||
        selected.type === "radio" ||
        selected.type === "checkbox") && (
        <Box>
          <Typography variant="subtitle2">Options</Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {(selected.options || []).map((opt) => (
              <Stack direction="row" spacing={1} key={opt.id}>
                <TextField
                  value={opt.label}
                  onChange={(e) => {
                    const updated = (selected.options || []).map((o) =>
                      o.id === opt.id ? { ...o, label: e.target.value } : o
                    );
                    patch({ options: updated });
                  }}
                />
                <TextField
                  value={opt.value}
                  onChange={(e) => {
                    const updated = (selected.options || []).map((o) =>
                      o.id === opt.id ? { ...o, value: e.target.value } : o
                    );
                    patch({ options: updated });
                  }}
                />
                <Button
                  onClick={() => {
                    const updated = (selected.options || []).filter(
                      (o) => o.id !== opt.id
                    );
                    patch({ options: updated });
                  }}
                >
                  Remove
                </Button>
              </Stack>
            ))}
            <Button
              onClick={() => {
                const newOpt = {
                  id: uuid(),
                  label: "Option",
                  value: `opt_${Math.random().toString(36).slice(2, 8)}`,
                };
                patch({ options: [...(selected.options || []), newOpt] });
              }}
            >
              Add option
            </Button>
          </Stack>
        </Box>
      )}

      <Button variant="outlined" onClick={() => setOpenDerived(true)}>
        Set Derived Field
      </Button>

      <DerivedFieldModal
        open={openDerived}
        onClose={() => setOpenDerived(false)}
        field={selected}
        allFields={fields}
        onSave={(patchData) => {
          patch(patchData);
          setOpenDerived(false);
        }}
      />
    </Stack>
  );
}
