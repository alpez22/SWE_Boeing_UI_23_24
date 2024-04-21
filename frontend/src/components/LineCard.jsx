import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Modal from "./Modal";
import "../style/style.css";

const LineIndicator = ({ weight }) => {
  let indicatorClass = "indicator ";
  if (weight >= 6800) {
    indicatorClass += "red-indicator";
  } else if (weight >= 5800) {
    indicatorClass += "orange-indicator";
  } else {
    indicatorClass += "green-indicator";
  }
  return <span className={indicatorClass} />;
};

function LineCard({ line }) {
  const [historicalTrash, setHistoricalTrash] = useState([]);
  const [historicalCanister, setHistoricalCanister] = useState([]);
  const [countTrash, setCountTrash] = useState(0);
  const [countCanister, setCountCanister] = useState(0);
  const [nextPageTrash, setNextPageTrash] = useState(1);
  const [nextPageCanister, setNextPageCanister] = useState(1);
  const [modalOpenTrash, setModalOpenTrash] = useState(false);
  const [modalOpenCanister, setModalOpenCanister] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3000/lines/${line.lineId}/trash-empties?page=0`).then(res => {
      setHistoricalTrash(res.data.trashEmpties)
      setCountTrash(res.data.count)
      console.log("historicalTrash: ");
      console.log(historicalTrash);
    })

    axios.get(`http://localhost:3000/lines/${line.lineId}/canister-changes?page=0`).then(res => {
      setHistoricalCanister(res.data.canisterChanges)
      setCountCanister(res.data.count)
      console.log("historicalCanister: ");
      console.log(historicalCanister);
    })
  }, [])

  async function loadMoreTrash() {
    const res = axios.get(`http://localhost:3000/lines/${line.lineId}/trash-empties?page=${nextPageTrash}`)
   
    setHistoricalTrash([...historicalTrash, ...res.data.trashEmpties])
    setCountTrash(res.data.count)
    setNextPage(nextPageTrash + 1)
  }

  async function loadMoreCanister() {
    const res = axios.get(`http://localhost:3000/lines/${line.lineId}/canister-changes?page=${nextPageCanister}`)
   
    setHistoricalCanister([...historicalCanister, ...res.data.canisterChanges])
    setCountCanister(res.data.count)
    setNextPage(nextPageCanister + 1)
  }

  const toggleTrashModal = () => setModalOpenTrash(!modalOpenTrash);
  const toggleCanisterModal = () => setModalOpenCanister(!modalOpenCanister);


  //empty trash can = 3lbs
  //full trash can = 16lbs
  return (
    <div className="line-card">
      <h2>Line ID: {line.lineId}</h2>
      <ul>
        <li>Canister Installation Date: {new Date(line.installationDate).toLocaleDateString()}</li>
        <li>Waste Rate: {line.wasteRate} oz/5min</li>
        <li>Weight: {line.weight} g</li>
      </ul>
      <div className="button-container">
        <Button className="purple-button" onClick={toggleTrashModal}>Show Historical Trash</Button>
        <Button className="purple-button" onClick={toggleCanisterModal}>Show Historical Canister</Button>
      </div>
      
      <Modal isOpen={modalOpenTrash} onClose={toggleTrashModal}>
        <h3>Historical Trash Data (Line {line.lineId})</h3>
        <ul>
          {historicalTrash && historicalTrash.map((trash, index) => (
            <div className="pair-container" key={index}>
              <li>emptied date: {new Date(trash.date).toLocaleDateString()}</li>
              <li>weight at time of emptied: {trash.weight} g</li>
            </div>
          ))}
        </ul>
        {historicalTrash && historicalTrash.length < countTrash && (
          <Button onClick={loadMoreTrash}>Load More</Button>
        )}
      </Modal>
      <Modal isOpen={modalOpenCanister} onClose={toggleCanisterModal}>
        <h3>Historical Canister Data (Line {line.lineId})</h3>
        <ul>
          {historicalCanister && historicalCanister.map((canister, index) => (
            <li key={index}>canister replaced date: {new Date(canister.date).toLocaleDateString()}</li>
          ))}
        </ul>
        {historicalCanister && historicalCanister.length < countCanister && (
          <Button onClick={loadMoreCanister}>Load More</Button>
        )}
      </Modal>
    </div>
  );
}

export default LineCard;
