import React, { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FormRenderer from "../components/FormRenderer";
import { useParams } from "react-router-dom";
import { loadFormById } from "../utils/localStorage";

export default function Preview() {
  const routeParams = useParams();
  const formId = routeParams.id;
  const builderFields = useSelector((s: RootState) => s.formBuilder.fields);
  const [schemaFields, setSchemaFields] = useState<any[]>([]);

  useEffect(() => {
    if (formId) {
      const schema = loadFormById(formId);
      if (schema) setSchemaFields(schema.fields);
      else setSchemaFields([]);
    } else {
      setSchemaFields(builderFields);
    }
  }, [formId, builderFields]);

  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Preview</Typography>
        <FormRenderer fields={schemaFields} />
      </Paper>
    </Box>
  );
}
