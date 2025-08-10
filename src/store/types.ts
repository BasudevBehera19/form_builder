export type FieldType = 
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export interface ValidationRules {
  notEmpty?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  email?: boolean;
  passwordRule?: boolean;
}

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string;
  options?: FieldOption[]; 
  validations?: ValidationRules;
  derived?: boolean;
  derivedParents?: string[]; 
  derivedExpression?: string; 
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string; // ISO
  fields: Field[];
}
