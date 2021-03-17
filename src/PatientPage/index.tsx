import React from "react";
import { useParams } from "react-router-dom";
import { Patient, Entry, HealthCheckEntry, OccupationalHealthCareEntry, HospitalEntry } from "../types";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import {updatePatient} from "../state/reducer";
import { Icon, Table, Container } from 'semantic-ui-react';


const fetchPatientInfo = async (id:string) => {
    const [, dispatch] = useStateValue();
    try {
      const { data: patientInfoFromApi } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );
      //dispatch({ type: "UPDATE_PATIENT", payload: patientInfoFromApi });
      dispatch(updatePatient(patientInfoFromApi));
    } catch (e) {
      console.error(e);
    }
};




const PatientPage = () => {
    const [{ patients }, ] = useStateValue();
    const [{ diagnosis }, ] = useStateValue();
    console.log(diagnosis);
    console.log(patients);
    const { id } = useParams<{ id: string }>();
    const patient = patients[id];
    if (patient.ssn) {
        console.log('ssn on olemassa');
    } else {
        console.log('ei ole vielä ssn:ää. pitää hakea!');
        void fetchPatientInfo(id);      
    }
    
    const diagnosisCodes = (codes:string[]) => {
        return (
            <ul>
                 {codes.map(code => 
                <li key={code}>{code}: {diagnosis[code].name}</li>
            )}
            </ul>
        );
    };

    const HospitalEntry = ({ entry }: { entry: HospitalEntry }) => {
        return (
            <div>
            <Table>
                <Table.Body>
                    <ul style={{marginTop:10}} key={entry.id}>
                    <Table.Row>
                        <Icon style={{marginLeft:-25, marginBottom:10}} name='hospital' size="large"/> <b>{entry.type}</b>
                    </Table.Row>
                    <Table.Row>
                        <li>Date: {entry.date}</li>
                    </Table.Row>
                    <Table.Row>
                        <li>Description: {entry.description}</li>
                        {entry.diagnosisCodes && <li>Diagnosis codes: {diagnosisCodes (entry.diagnosisCodes)}</li>}
                    </Table.Row>
                </ul>
                </Table.Body>
            </Table>
        </div>
        );
    };

    const OccupationalHealthCareEntry = ({ entry }: { entry: OccupationalHealthCareEntry }) => {
        return (
            <div>
                <Table>
                    <Table.Body>
                      <ul style={{marginTop:15}} key={entry.id}>
                    <Table.Row>
                        <li>Type: {entry.type} <Icon style={{marginLeft:10}} name='factory' size="large"/></li>
                    </Table.Row>
                    <Table.Row>
                        <li>Date: {entry.date}</li>
                    </Table.Row>
                    <Table.Row>
                        <li>Description: {entry.description}</li>
                        {entry.diagnosisCodes && <li>Diagnosis codes: {diagnosisCodes (entry.diagnosisCodes)}</li>}
                    </Table.Row>
                 </ul>
                </Table.Body>
            </Table>
        </div>
        );
    };

    const HealthCheckEntry = ({ entry }: { entry: HealthCheckEntry }) => {


        const color = (input:number): "orange"|"green" =>  {
            if (input==0) {
                return "orange";
            } else {
                return "green";
            }
        };

        return (
            <div>
                <Table>
                    <Table.Body>
                    <ul style={{marginTop:15}} key={entry.id}>
                        <Table.Row>
                            <li>Type: {entry.type} <Icon style={{marginLeft:10}} name='clock outline' size="large"/></li>
                        </Table.Row>
                        <Table.Row>
                            <li>Date: {entry.date}</li>
                        </Table.Row>
                        <Table.Row>
                            <li>Description: {entry.description}</li>
                        </Table.Row>
                        <Table.Row>
                            <li>Health check rating: {entry.healthCheckRating} <Icon name="heart" color={color(entry.healthCheckRating)}/></li>
                        </Table.Row>
                    </ul>
                    </Table.Body>
                </Table>
            </div>
        );
    };

    const EntryDetails = ({ entry }: { entry: Entry })  => {
        switch (entry.type) {
            case "HealthCheck":
                return (
                    <div>
                        <HealthCheckEntry entry={entry} />
                    </div>
                );            
            case "OccupationalHealthcare":
                return (
                    <div>
                        <OccupationalHealthCareEntry entry={entry} />
                    </div>
                );               
            case "Hospital":
                    return (
                        <div>
                            <HospitalEntry entry={entry} />
                        </div>
                    );                  
            default:
            return assertNever(entry);
        }
    };

    const assertNever = (value: never): never => {
        throw new Error(
          `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
      };

    return (
        <div>
            <Container>
            <h1>{patient.name} {patient.gender=='male' && <Icon name='mars'/>} {patient.gender=='female' && <Icon name='venus'/>}</h1>
            ssn: {patient.ssn}<br></br>
            occupation: {patient.occupation}
            <br></br><br></br>
            {patient.entries.length>0 && <div style={{marginBottom:10}}><h4><b>Entries</b></h4></div>}
            {patient.entries.map(entry => 
                <p key={entry.id}>
                    <EntryDetails entry={entry} />
                </p>
            )}
            </Container>
        </div>
    );
};

export default PatientPage;