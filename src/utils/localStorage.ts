import { FormSchema } from '../store/types'

const KEY = "forms_Data";

export function saveFormSchema(schema: FormSchema) {
    const all = loadAllForms();
    all.push(schema);
    localStorage.setItem(KEY, JSON.stringify(all));
}

export function loadAllForms(): FormSchema[] {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];
        return JSON.parse(raw) as FormSchema[];
    } catch {
        return [];
    }
}

export function loadFormById(id: string): FormSchema | undefined {
    return loadAllForms().find((f) => f.id === id);
}

export function updateFormSchema(updated: FormSchema) {
    const all = loadAllForms().map((f) => (f.id === updated.id ? updated : f));
    localStorage.setItem(KEY, JSON.stringify(all));
}
