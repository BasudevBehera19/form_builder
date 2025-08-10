import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Field } from "./types";
import { v4 as uuid } from "uuid";

interface BuilderState {
    fields: Field[];
}

const initialState: BuilderState = {
    fields: []
};

const slice = createSlice({
    name: "formBuilder",
    initialState,
    reducers: {
        setFields(state, action: PayloadAction<Field[]>) {
            state.fields = action.payload;
        },
        addField(state, action: PayloadAction<Partial<Field> | undefined>) {
            const newField: Field = {
                id: uuid(),
                type: (action.payload?.type as any) || "text",
                label: action.payload?.label || "Untitled",
                required: action.payload?.required ?? false,
                defaultValue: action.payload?.defaultValue ?? "",
                options: action.payload?.options ?? [],
                validations: action.payload?.validations ?? {},
                derived: false,
                derivedParents: [],
                derivedExpression: ""
            };
            state.fields.push(newField);
        },
        updateField(state, action: PayloadAction<{ id: string; patch: Partial<Field> }>) {
            const idx = state.fields.findIndex((f) => f.id === action.payload.id);
            if (idx >= 0) state.fields[idx] = { ...state.fields[idx], ...action.payload.patch };
        },
        removeField(state, action: PayloadAction<string>) {
            state.fields = state.fields.filter((f) => f.id !== action.payload);
        },
        moveFieldUp(state, action: PayloadAction<string>) {
            const idx = state.fields.findIndex((f) => f.id === action.payload);
            if (idx > 0) {
                const a = state.fields[idx - 1];
                state.fields[idx - 1] = state.fields[idx];
                state.fields[idx] = a;
            }
        },
        moveFieldDown(state, action: PayloadAction<string>) {
            const idx = state.fields.findIndex((f) => f.id === action.payload);
            if (idx >= 0 && idx < state.fields.length - 1) {
                const a = state.fields[idx + 1];
                state.fields[idx + 1] = state.fields[idx];
                state.fields[idx] = a;
            }
        },
        reset(state) {
            state.fields = [];
        }
    }
});

export const {
    setFields,
    addField,
    updateField,
    removeField,
    moveFieldUp,
    moveFieldDown,
    reset
} = slice.actions;

export default slice.reducer;
