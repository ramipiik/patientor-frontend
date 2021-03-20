import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, SelectField, GenderOption } from "../AddPatientModal/FormField";
import { EntryFormValues, Gender } from "../types";


/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */

//export type PatientFormValues = Omit<Patient, "id" | "entries">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const genderOptions: GenderOption[] = [
  { value: Gender.Male, label: "Male" },
  { value: Gender.Female, label: "Female" },
  { value: Gender.Other, label: "Other" }
];

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
            errors.dateOfBirth = requiredError;
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
              <SelectField
                label="Gender"
                name="gender"
                options={genderOptions}
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
