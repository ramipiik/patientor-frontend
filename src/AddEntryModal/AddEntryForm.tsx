/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField, NumberField } from "../AddPatientModal/FormField";
import { EntryType, EntryFormValues } from "../types";
import { entryTypeOptions, SelectField } from "./Components";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   onSubmit: (values: any) => void;
  onCancel: () => void;
}


export const AddEntryForm = ({ onSubmit, onCancel } : Props ) => {
    const min = 0;
    const max = 10;
    return (
      <Formik
        initialValues={{
          date: "",
          specialist: "",
          description: "",
          type: EntryType.HealthCheck
        }}
        onSubmit={onSubmit}
        validate={values => {
          const requiredError = "Field is required";
          const errors: { [field: string]: string } = {};
          if (!values.date) {
            errors.date = requiredError;
          }
          if (!values.type) {
            errors.type = requiredError;
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.healthCheckRating ) {
            errors.healthCheckRating = requiredError;
          }
          if (values.healthCheckRating && values.healthCheckRating<-1) {
            errors.healthCheckRating = "minimum value is 0";
          }
          if (values.healthCheckRating && values.healthCheckRating>10 ) {
            errors.healthCheckRating = "maximum value is 10";
          }
          return errors;
        }}
      >
        {({ isValid, dirty }) => {
          return (
            <Form className="form ui">
              <SelectField
                label="Entry type"
                // name="entryType"
                name="type"
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
                placeholder="0-10"
                name="healthCheckRating"
                min={min}
                max={max}
                component={NumberField}
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
