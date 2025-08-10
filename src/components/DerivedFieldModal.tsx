import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { Field } from "../store/types";

interface Props {
  open: boolean;
  onClose: () => void;
  field: Field | null;
  allFields: Field[];
  onSave: (patch: Partial<Field>) => void;
}

export default function DerivedFieldModal({
  open,
  onClose,
  field,
  allFields,
  onSave,
}: Props) {
  const [isDerived, setIsDerived] = useState(false);
  const [parents, setParents] = useState<string[]>([]);
  const [expr, setExpr] = useState("");

  useEffect(() => {
    if (!field) return;
    setIsDerived(!!field.derived);
    setParents(field.derivedParents || []);
    setExpr(field.derivedExpression || "");
  }, [field]);

  if (!field) return null;

  const candidateParents = allFields.filter((f) => f.id !== field.id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Derived Field: {field.label}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDerived}
                onChange={(e) => setIsDerived(e.target.checked)}
              />
            }
            label="Is Derived Field"
          />
          {isDerived && (
            <>
              <Typography variant="subtitle2">Select parent fields</Typography>
              <Stack sx={{ maxHeight: 200, overflow: "auto" }}>
                {candidateParents.map((p) => (
                  <FormControlLabel
                    key={p.id}
                    control={
                      <Checkbox
                        checked={parents.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) setParents([...parents, p.id]);
                          else setParents(parents.filter((id) => id !== p.id));
                        }}
                      />
                    }
                    label={`${p.label} (${p.type})`}
                  />
                ))}
              </Stack>

              <TextField
                label="Expression"
                helperText="Use f_<fieldId> to reference parent fields, e.g., f_abc + ' ' + f_xyz or numeric expr f_a * f_b"
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                fullWidth
              />
              <Typography variant="caption">
                Example expression: (parseFloat(f_price) || 0) *
                (parseFloat(f_qty) || 0)
              </Typography>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onSave({
              derived: isDerived,
              derivedParents: isDerived ? parents : [],
              derivedExpression: isDerived ? expr : "",
            });
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
