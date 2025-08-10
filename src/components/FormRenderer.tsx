import React, { useState, useEffect } from "react";
import { Field } from "../store/types";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  fields: Field[];
}

type Values = Record<string, any>;
type Errors = Record<string, string | null>;

export default function FormRenderer({ fields }: Props) {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    // initialize defaults
    const initial: Values = {};
    fields.forEach((f) => {
      initial[f.id] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
    });
    setValues(initial);
  }, [fields]);

  // Evaluate derived fields based on expression safely (sandboxed via Function)
  useEffect(() => {
    const newValues = { ...values };
    fields.forEach((f) => {
      if (f.derived && f.derivedExpression) {
        try {
          const ctx: Record<string, any> = {};
          (f.derivedParents || []).forEach((pid) => {
            ctx[`f_${pid}`] = values[pid];
          });
          // Build a function with parent references available
          const fn = new Function(
            ...Object.keys(ctx),
            `return (${f.derivedExpression});`
          );
          const result = fn(...Object.values(ctx));
          newValues[f.id] = result ?? "";
        } catch (e) {
          newValues[f.id] = "";
        }
      }
    });
    setValues(newValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, JSON.stringify(values)]);

  function validateField(f: Field, v: any): string | null {
    const valStr = typeof v === "string" ? v : String(v ?? "");
    if (f.validations?.notEmpty && (!v || valStr.trim() === "")) {
      return "Cannot be empty";
    }
    if (f.validations?.minLength && valStr.length < f.validations.minLength) {
      return `Min length ${f.validations.minLength}`;
    }
    if (f.validations?.maxLength && valStr.length > f.validations.maxLength) {
      return `Max length ${f.validations.maxLength}`;
    }
    if (f.validations?.email) {
      const re = /^\S+@\S+\.\S+$/;
      if (v && !re.test(v)) return "Invalid email";
    }
    if (f.validations?.passwordRule) {
      const hasNum = /\d/.test(String(v ?? ""));
      if (String(v ?? "").length < 8 || !hasNum)
        return "Password must be min 8 characters and contain a number";
    }
    if (
      f.required &&
      (v === "" ||
        v === undefined ||
        v === null ||
        (typeof v === "boolean" && v === false))
    ) {
      return "Required";
    }
    return null;
  }

  function handleChange(id: string, value: any) {
    setValues((s) => ({ ...s, [id]: value }));
    // validate on change
    const f = fields.find((x) => x.id === id);
    if (f) {
      const err = validateField(f, value);
      setErrors((s) => ({ ...s, [id]: err }));
    }
  }

  function handleSubmit() {
    const newErrors: Errors = {};
    fields.forEach((f) => {
      newErrors[f.id] = validateField(f, values[f.id]);
    });
    setErrors(newErrors);
    const hasErr = Object.values(newErrors).some((e) => e);
    if (hasErr) {
      alert("Fix validation errors");
      return;
    }
    alert("Form valid! (values logged to console)");
    console.log("Form submit values:", values);
  }

  return (
    <Stack spacing={2}>
      {fields.map((f) => {
        const val = values[f.id] ?? "";
        const err = errors[f.id] ?? null;
        if (f.type === "text" || f.type === "number" || f.type === "date") {
          return (
            <TextField
              key={f.id}
              label={f.label}
              type={
                f.type === "number"
                  ? "number"
                  : f.type === "date"
                  ? "date"
                  : "text"
              }
              value={val}
              onChange={(e) => handleChange(f.id, e.target.value)}
              helperText={err ?? ""}
              error={!!err}
              InputLabelProps={f.type === "date" ? { shrink: true } : undefined}
            />
          );
        }
        if (f.type === "textarea") {
          return (
            <TextField
              key={f.id}
              label={f.label}
              multiline
              minRows={3}
              value={val}
              onChange={(e) => handleChange(f.id, e.target.value)}
              helperText={err ?? ""}
              error={!!err}
            />
          );
        }
        if (f.type === "checkbox") {
          return (
            <FormControlLabel
              key={f.id}
              control={
                <Checkbox
                  checked={!!val}
                  onChange={(e) => handleChange(f.id, e.target.checked)}
                />
              }
              label={f.label}
            />
          );
        }
        if (f.type === "radio") {
          return (
            <FormControl key={f.id}>
              <FormLabel>{f.label}</FormLabel>
              <RadioGroup
                value={val}
                onChange={(e) => handleChange(f.id, e.target.value)}
              >
                {(f.options || []).map((o) => (
                  <FormControlLabel
                    key={o.id}
                    value={o.value}
                    control={<Radio />}
                    label={o.label}
                  />
                ))}
              </RadioGroup>
              {err && (
                <Typography color="error" variant="caption">
                  {err}
                </Typography>
              )}
            </FormControl>
          );
        }
        if (f.type === "select") {
          return (
            <FormControl key={f.id}>
              <InputLabel>{f.label}</InputLabel>
              <Select
                value={val}
                label={f.label}
                onChange={(e) => handleChange(f.id, e.target.value)}
              >
                {(f.options || []).map((o) => (
                  <MenuItem key={o.id} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
              {err && (
                <Typography color="error" variant="caption">
                  {err}
                </Typography>
              )}
            </FormControl>
          );
        }
        return null;
      })}
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Stack>
  );
}
