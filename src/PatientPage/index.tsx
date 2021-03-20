/* eslint-disable @typescript-eslint/no-unused-vars */


import React from "react";
import { useParams } from "react-router-dom";
import { Patient, Entry, HealthCheckEntry, OccupationalHealthCareEntry, HospitalEntry, EntryFormValues, ToNewEntry } from "../types";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import {updatePatient} from "../state/reducer";
import { Icon, Table, Container, Button } from 'semantic-ui-react';
import AddEntryModal from "../AddEntryModal";
import {v1 as uuid} from 'uuid';


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
            <ul >
                <div style={{marginBottom: -12}}>  </div>
                 {codes.map(code => 
                <li key={code}>{code}: {diagnosis[code].name}</li>
               
            )}
            </ul>
        );
    };

    const HospitalEntry = ({ entry }: { entry: HospitalEntry }) => {
        return (
            <div>
            <Table style={{paddingLeft:15, paddingTop:10, paddingBottom:10}}>
                <Table.Body style={{paddingLeft:15}}>
                    <Table.Row style={{marginTop:10, paddingLeft:15}}>
                        <Icon style={{marginLeft:0, marginBottom:10}} name='hospital' size="large"/> {entry.type}
                    </Table.Row>
                    <Table.Row>
                        - Date: {entry.date}
                    </Table.Row>
                    <Table.Row>
                        - Description: {entry.description}
                        {entry.diagnosisCodes && <div>- Diagnosis codes: {diagnosisCodes (entry.diagnosisCodes)}</div>}
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
        );
    };

    const OccupationalHealthCareEntry = ({ entry }: { entry: OccupationalHealthCareEntry }) => {
        return (
            <div>
                <Table style={{paddingLeft:15, paddingTop:10, paddingBottom:10}}>
                    <Table.Body>
                    <Table.Row style={{marginTop:15}}>
                            Type: {entry.type} <Icon style={{marginLeft:10}} name='factory' size="large"/>
                    </Table.Row>
                    <Table.Row>
                        - Date: {entry.date}
                    </Table.Row>
                    <Table.Row>
                        - Description: {entry.description}
                        {entry.diagnosisCodes && <div>- Diagnosis codes: {diagnosisCodes (entry.diagnosisCodes)}</div>}
                    </Table.Row>
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
                <Table style={{paddingLeft:15, paddingTop:10, paddingBottom:10}}>
                    <Table.Body>
                        <Table.Row style={{marginTop:15}}>
                            Type: {entry.type} <Icon style={{marginLeft:10}} name='clock outline' size="large"/>
                        </Table.Row>
                        <Table.Row>
                            - Date: {entry.date}
                        </Table.Row>
                        <Table.Row>
                            - Description: {entry.description}
                        </Table.Row>
                        <Table.Row>
                            - Health check rating: {entry.healthCheckRating} <Icon name="heart" color={color(entry.healthCheckRating)}/>
                        </Table.Row>
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
    

      const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();

    const openModal = (): void => {
    console.log(`modalOpen:`, modalOpen);
    setModalOpen(true);
    console.log(`modalOpen:`, modalOpen);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };


    // const testSubmit = () => {
    //     console.log("moi!");
    // };

    const submitNewEntry = async (values: EntryFormValues) => {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const entryId:string = uuid();
    const values2 = {...values, entryId};
    
    console.log('Trying to send following data to BE:');
    console.log(values2);
    try {
      const { data: newEntry } = await axios.post<ToNewEntry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values2
      );
      console.log('response from BE');
      console.log(newEntry);
      //dispatch(addEntry(newEntry)); //pitääkö tehdä entryjen tilan hallinta fronttiin? Ei varmaan tarvii. 
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

    return (
        <div>
            <Container>
            <h3>Patient information</h3>
            </Container>
            <h1>{patient.name} {patient.gender=='male' && <Icon name='mars'/>} {patient.gender=='female' && <Icon name='venus'/>}</h1>
            <p style={{marginBottom:0}}>Social security number {patient.ssn}</p>
            <p style={{marginTop:0}}>Occupation: {patient.occupation} </p>
            <Button onClick={() => openModal()} style={{marginTop:20, marginBottom:30}} secondary>Add new entry</Button>
            {patient.entries.length>0 && <div style={{marginBottom:10}}><h4><b>Entries</b></h4></div>}
            {patient.entries.map(entry => 
                <div key={entry.id}>
                    <EntryDetails entry={entry} />
                </div>
            )}
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={() => console.log("moi")}
          error={error}
          onClose={closeModal}
      />
 
        </div>
    );
};

export default PatientPage;