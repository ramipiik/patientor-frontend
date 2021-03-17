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

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[]
}

export type Entry =  HospitalEntry | OccupationalHealthCareEntry | HealthCheckEntry;

interface BaseEntry {
    id: string,
    date: string,
    specialist: string,
    description: string,
    diagnosisCodes?: string[],
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
