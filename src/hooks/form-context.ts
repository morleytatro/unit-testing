import { createContext, useContext } from 'react';

interface FormContextType {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  setValue: (name: string, value: unknown) => void;
  submitCount: number;
  reset: () => void;
}

export const FormContext = createContext<FormContextType>(undefined!);

export const useFormContext = () => useContext(FormContext);
