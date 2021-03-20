import React from "react";
import { Field } from "formik";
import { Form } from "semantic-ui-react";
import { EntryType } from "../types";

// structure of a single option
export type EntryTypeOption = {
    value: EntryType;
    label: string;
    name: string;
  };
  
  // props for select field component
export type SelectFieldProps = {
    name: string;
    label: string;
    options: EntryTypeOption[];
  };

export const entryTypeOptions: EntryTypeOption[] = [
    { value: EntryType.HealthCheck, label: "Health check", name: "test1" },
    { value: EntryType.Hospital, label: "Hospital", name: "test2"},
    { value: EntryType.OccupationalHealthcare, label: "Occupational health care", name: "test3"}
  ];

export const SelectField = ({
    name,
    label,
    options
  }: SelectFieldProps) => (
    <Form.Field>
      <label>{label}</label>
      <Field as="select" name={name} className="ui dropdown">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
            {/* {option.value} */}
          </option>
        ))}
      </Field>
    </Form.Field>
  );