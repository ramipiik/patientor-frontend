import React from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import {updatePatient} from "../state/reducer";
import { Icon } from 'semantic-ui-react';


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
            <div>
                 {codes.map(code => 
                <div key={code}>{code} </div>
            )}
            </div>
        );
    };

    return (
        <div>
            <h1>{patient.name} {patient.gender=='male' && <Icon name='mars'/>} {patient.gender=='female' && <Icon name='venus'/>}</h1>
            ssn: {patient.ssn}<br></br>
            occupation: {patient.occupation}
            <br></br><br></br>
            <div style={{marginBottom:-10}}><b>Entries:</b></div>
            {patient.entries.map(entry => 
                <ul style={{marginTop:15}} key={entry.id}>
                 <li>Date: {entry.date}</li>
                 <li>Type: {entry.type}</li>
                 <li>Description: {entry.description}</li>
                 {/* {entry.diagnosisCodes && <li>Diagnosis codes: {entry.diagnosisCodes}</li>} */}
                 {entry.diagnosisCodes && <li>Diagnosis codes: {diagnosisCodes (entry.diagnosisCodes)}</li>}
            </ul>
            )}
        </div>
    );
};

export default PatientPage;