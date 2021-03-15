/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";


const fetchPatientInfo = async (id:string) => {

    const [, dispatch] = useStateValue();
    try {
      const { data: patientInfoFromApi } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );
      dispatch({ type: "UPDATE_PATIENT", payload: patientInfoFromApi });
    //   console.log(patientInfoFromApi);
    } catch (e) {
      console.error(e);
    }

    // console.log(patients);
};


const PatientPage = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ patients }, dispatch] = useStateValue();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //const patient = patients.find(patient => patient.id === id);

    console.log('Mikä tuo on?');
    console.log(patients);

    const { id } = useParams<{ id: string }>();
    console.log(id);
    const patient = patients[id];
    if (patient.ssn) {
        console.log('ssn on olemassa');
    } else {
        console.log('ei ole vielä ssn:ää. pitää hakea!');
        void fetchPatientInfo(id);
        

    }
    console.log(patient);
    return (
        <div>
            <h1>{patient.name} ({patient.gender})</h1>

            ssn: {patient.ssn}<br></br>
            occupation: {patient.occupation}
        </div>
    );
};

export default PatientPage;