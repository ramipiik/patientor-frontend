import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik } from "formik";
import { Form } from "semantic-ui-react";
import { TextField } from "../AddPatientModal/FormField";
import { EntryFormValues, Gender, EntryType } from "../types";


interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

// const genderOptions: GenderOption[] = [
//   { value: Gender.Male, label: "Male" },
//   { value: Gender.Female, label: "Female" },
//   { value: Gender.Other, label: "Other" }
// ];


// structure of a single option
type EntryTypeOption = {
    value: EntryType;
    label: string;
  };
  
  // props for select field component
  type SelectFieldProps = {
    name: string;
    label: string;
    options: EntryTypeOption[];
  };

const entryTypeOptions: EntryTypeOption[] = [
    { value: EntryType.HealthCheck, label: "Health check" },
    { value: EntryType.Hospital, label: "Hospital" },
    { value: EntryType.OccupationalHealthcare, label: "Occupational health care" }
  ];

const SelectField = ({
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
          </option>
        ))}
      </Field>
    </Form.Field>
  );

export const AddEntryForm = ({ onSubmit, onCancel } : Props ) => {
    return (
      <Formik
        initialValues={{
          date: "",
          specialist: "",
          description: "",
          healthCheckRating: "",
          gender: Gender.Other
        }}
        onSubmit={onSubmit}
        validate={values => {
          const requiredError = "Field is required";
          const errors: { [field: string]: string } = {};
          if (!values.date) {
            errors.date = requiredError;
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.healthCheckRating) {
            errors.healthCheckRating = requiredError;
          }
          return errors;
        }}
      >
        {({ isValid, dirty }) => {
          return (
            <Form className="form ui">
              <SelectField
                label="Entry type"
                name="entryType"
                options={entryTypeOptions}
              />
              <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="date"
                component={TextField}
              />
              <Field
                label="Specialist"
                placeholder="Specialist"
                name="specialist"
                component={TextField}
              />
              <Field
                label="Description"
                placeholder="description"
                name="description"
                component={TextField}
              />
              <Field
                label="Healthcheck rating"
                placeholder="0 / 1"
                name="healthCheckRating"
                component={TextField}
              />
              <Grid>
                <Grid.Column floated="left" width={5}>
                  <Button type="button" onClick={onCancel} color="red">
                    Cancel
                  </Button>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                  <Button
                    type="submit"
                    floated="right"
                    color="green"
                    disabled={!dirty || !isValid}
                  >
                    Add
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    );
  };

export default AddEntryForm;
