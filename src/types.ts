export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export enum EntryType {
  OccupationalHealthcare = "Occupational healthcare",
  Hospital = "Hospital",
  HealthCheck = "HealthCheck"
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[]
}

export interface Diagnose {
  code: string,
  name: string,
  latin?: string
}

export type Entry =  HospitalEntry | OccupationalHealthCareEntry | HealthCheckEntry;

export interface BaseEntry {
    id: string,
    date: string,
    specialist: string,
    description: string,
    diagnosisCodes?: string[],
  }

type EntryFormValuesHelper = Omit<BaseEntry, "id" | "diagnosisCodes">;
export interface EntryFormValues extends EntryFormValuesHelper {
  gender: Gender,
  healthCheckRating: string
} 

export interface OccupationalHealthCareEntry extends BaseEntry {
    type: 'OccupationalHealthcare',
    employerName: string,
    sickLeave?: {
        startDate: string,
        endDate: string
    }
}

export interface HospitalEntry extends BaseEntry {
    type: 'Hospital',
    discharge: {
        date: string,
        criteria: string
    };
}

export interface HealthCheckEntry extends BaseEntry {
    type: 'HealthCheck',
    healthCheckRating: number,
}
