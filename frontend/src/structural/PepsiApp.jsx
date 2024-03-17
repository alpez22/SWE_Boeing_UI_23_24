import React, { useState, useEffect } from "react";
import { Col, Card, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function PepsiApp() {
    const [serial, setSerial] = useState("");
    const [line, setLine] = useState("")
    const [installation, setInstallation] = useState("");
    const [canisters, setCanisters] = useState(() => {
        const savedCanisters = localStorage.getItem("canisters");
        return savedCanisters ? JSON.parse(savedCanisters) : [];
    });

    useEffect(() => {
        localStorage.setItem("canisters", JSON.stringify(canisters));
    }, [canisters]);

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

    const deleteCanister = (indexToDelete) => {
        // Use window.confirm to ask for confirmation
        const isConfirmed = window.confirm("Are you sure you want to delete this canister?");
        if (isConfirmed) {
            const filteredCanisters = canisters.filter((_, index) => index !== indexToDelete);
            setCanisters(filteredCanisters);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', boxSizing: 'border-box' }}>
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
              <Card key={index} style={{ marginTop: '10px', position: 'relative' }}>
                <Button style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'white', color: 'black', borderColor: 'red' }} onClick={() => deleteCanister(index)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
                <Card.Body>
                  <Card.Title>Serial: {canister.serial}</Card.Title>
                  <Card.Text>Installation Date: {canister.installation}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
          
          {/* Line Column */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', boxSizing: 'border-box' }}>
            <h2>Line</h2>
            {/* Content for the Line goes here */}
            <Col>
                <Form.Label htmlFor="line">Line #</Form.Label>
                <Form.Control 
                    type="text" 
                    value={line} 
                    onChange={(e) => setLine(e.target.value)} 
                    id="line" />
            
                <br />
                <Button onClick={createCanister}>Add Line</Button>
            </Col>
          </div>
        </div>
    );
}
export default PepsiApp;
