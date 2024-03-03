import React, { useEffect, useState, useContext } from "react"
import { Row, Col, Card, Pagination, Button, Form, Container } from "react-bootstrap";

function PepsiApp(){

    const[serial, setSerial] = useState("");
    const[installation, setInstallation] = useState("");

    const createCanister = () => {
        // Simple validation
        if (!serial || !installation) {
          alert("Please fill in all fields");
          return;
        }
    
        const newCanister = { serial, installation };
        setCanisters([...canisters, newCanister]);
    
        // Optionally clear the form fields after adding
        setSerial("");
        setInstallation("");
      };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
        {/* Canister Column */}
        <div style={{ flex: 1, padding: '20px' }}>
          {/* Content for column 1 goes here */}
          <h2>Canisters</h2>
          <Col>
                <Form.Label id="serial" htmlFor="serial">Serial #</Form.Label>
                <Form.Control type="text" value={serial} onChange={(e) => setSerial(e.target.value)} id="serial"></Form.Control>
                <Form.Label id="serial" htmlFor="installation">Installation Date</Form.Label>
                <Form.Control  type="installation" value={installation} onChange={(e) => setInstallation(e.target.value)} id="installation"></Form.Control>
                <br></br>
                <Button onClick={createCanister}>Add Canister</Button>
            </Col>
        </div>
        
        {/* Line Column */}
        <div style={{ flex: 1, padding: '20px' }}>
          {/* Content for column 2 goes here */}
          <h2>Line</h2>
          
        </div>
      </div>
    );
}
export default PepsiApp;