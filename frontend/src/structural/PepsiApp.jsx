import React, { useState } from "react";
import { Col, Card, Button, Form } from "react-bootstrap";

function PepsiApp() {
    const [serial, setSerial] = useState("");
    const [installation, setInstallation] = useState("");
    const [canisters, setCanisters] = useState([]);

    const createCanister = () => {
        if (!serial || !installation) {
          alert("Please fill in all fields");
          return;
        }
    
        const newCanister = { serial, installation };
        setCanisters([...canisters, newCanister]);
        setSerial("");
        setInstallation("");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', boxSizing: 'border-box', overflowX: 'hidden' }}>
          {/* Canister Column */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', boxSizing: 'border-box' }}>
            <h2>Canisters</h2>
            <Col>
                <Form.Label htmlFor="serial">Serial #</Form.Label>
                <Form.Control 
                    type="text" 
                    value={serial} 
                    onChange={(e) => setSerial(e.target.value)} 
                    id="serial" />
                <Form.Label htmlFor="installation">Installation Date</Form.Label>
                <Form.Control 
                    type="date"
                    value={installation} 
                    onChange={(e) => setInstallation(e.target.value)} 
                    id="installation" />
                <br />
                <Button onClick={createCanister}>Add Canister</Button>
            </Col>
            {canisters.map((canister, index) => (
              <Card key={index} style={{ marginTop: '10px' }}>
                <Card.Body>
                  <Card.Title>Canister {index + 1}</Card.Title>
                  <Card.Text>Serial: {canister.serial}</Card.Text>
                  <Card.Text>Installation Date: {canister.installation}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
          
          {/* Line Column */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', boxSizing: 'border-box' }}>
            <h2>Line</h2>
            {/* Content for the Line goes here */}
          </div>
        </div>
    );
}
export default PepsiApp;
