import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Modal from "./Modal";
import "../style/style.css";

/* TRASH in {grams} && CANISTER in {grams per second} */
/* empty trash can = 3lbs */
/* full trash can = 16lbs */
const TRASH_RED_INDICATOR = 6800; //15lbs out of 16 lbs
const TRASH_ORANGE_INDICATOR = 5800; //13lbs out of 16 lbs
const TRASH_GREEN_INDICATOR = 0;
const CANISTER_RED_INDICATOR = 0.034; //16lbs per 60 hours
const CANISTER_ORANGE_INDICATOR = 0.027; //13lbs per 60 hours
const CANISTER_GREEN_INDICATOR = 0.0;


function LineCard({ line }) {
  const [historicalTrash, setHistoricalTrash] = useState([]);
  const [historicalCanister, setHistoricalCanister] = useState([]);
  const [countTrash, setCountTrash] = useState(0);
  const [countCanister, setCountCanister] = useState(0);
  const [nextPageTrash, setNextPageTrash] = useState(1);
  const [nextPageCanister, setNextPageCanister] = useState(1);
  const [modalOpenTrash, setModalOpenTrash] = useState(false);
  const [modalOpenCanister, setModalOpenCanister] = useState(false);
  const [weightIndicatorColor, setWeightIndicatorColor] = useState('blue');
  const [wasteRateIndicatorColor, setWasteRateIndicatorColor] = useState('blue');

  /* utility function to determine indicator color */
  const getIndicatorColor = (value, redIndicator, orangeIndicator, greenIndicator) => {
    if (value >= redIndicator) {
      return 'red';
    } else if (value >= orangeIndicator) {
      return 'orange';
    } else if (value >= greenIndicator) {
      return 'green';
    }
    return 'blue'; // default color if none of the conditions are met
  };

  useEffect(() => {
    setWeightIndicatorColor(getIndicatorColor(line.weight, TRASH_RED_INDICATOR, TRASH_ORANGE_INDICATOR, TRASH_GREEN_INDICATOR));
  }, [line.weight]);
  
  useEffect(() => {
    setWasteRateIndicatorColor(getIndicatorColor(line.wasteRate, CANISTER_RED_INDICATOR, CANISTER_ORANGE_INDICATOR, CANISTER_GREEN_INDICATOR));
  }, [line.wasteRate]);
  

  /* set the colors for the weight indicator && waste rate indicator */
  useEffect(() => {
    if (line.weight >= TRASH_RED_INDICATOR) {
      setWeightIndicatorColor('red');
    } else if (line.weight >= TRASH_ORANGE_INDICATOR) {
      setWeightIndicatorColor('orange');
    } else if (line.weight >= TRASH_GREEN_INDICATOR) {
      setWeightIndicatorColor('green');
    }
  }, [line.weight]);
  useEffect(() => {
    if (line.wasteRate >= CANISTER_RED_INDICATOR) {
      setWasteRateIndicatorColor('red');
    } else if (line.wasteRate >= CANISTER_ORANGE_INDICATOR) {
      setWasteRateIndicatorColor('orange');
    } else if (line.wasteRate >= CANISTER_GREEN_INDICATOR) {
      setWasteRateIndicatorColor('green');
    }
  }, [line.wasteRate]);

  /* set historical trash && set historical canister */
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

  /* load more button for trash && canister */
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

  /* set + refresh trash modal && canister modal  */
  const toggleTrashModal = () => {
    if (!modalOpenTrash) {
      axios.get(`http://localhost:3000/lines/${line.lineId}/trash-empties?page=0`)
      .then(res => {
        setHistoricalTrash(res.data.trashEmpties)
        setCountTrash(res.data.count)
      });
    }
    setModalOpenTrash(!modalOpenTrash)
  };
  const toggleCanisterModal = () => {
    if (!modalOpenCanister) {
      axios.get(`http://localhost:3000/lines/${line.lineId}/canister-changes?page=0`)
      .then(res => {
        setHistoricalCanister(res.data.canisterChanges)
        setCountCanister(res.data.count)
      });
    }
    setModalOpenCanister(!modalOpenCanister)
  };


  return (
    <div className="line-card">
      <h2>Line ID: {line.lineId}</h2>
      <ul>
        <li><span><em>Canister Installation Date:</em> <strong>{new Date(line.installationDate).toLocaleDateString()}</strong></span></li>
        <li><span><em>Waste Rate:</em> <strong>{line.wasteRate} g/sec</strong></span></li>
        <li><span><em>Weight:</em> <strong>{line.weight} g</strong></span></li>
      </ul>
      <div className="indicators">
        <div className="indicator" style={{ backgroundColor: weightIndicatorColor }}>Trash</div>
        <div className="indicator" style={{ backgroundColor: wasteRateIndicatorColor }}>Canister</div>
      </div>
      <div className="button-container">
        <Button className="purple-button" onClick={toggleTrashModal}>Show Historical Trash</Button>
        <Button className="purple-button" onClick={toggleCanisterModal}>Show Historical Canister</Button>
      </div>
      
      <Modal isOpen={modalOpenTrash} onClose={toggleTrashModal}>
        <h3 style={{ fontSize: "38px" }}><strong>Historical Trash Data </strong> <em>Line {line.lineId}</em></h3>
        <ul>
          {historicalTrash && historicalTrash.map((trash, index) => (
            <div className="pair-container" key={index}>
              <li><span><em>emptied date: </em><strong>{new Date(trash.date).toLocaleDateString()}</strong></span></li>
              <li><span><em>weight at time of emptied: </em><strong>{trash.weight} g </strong></span></li>
            </div>
          ))}
        </ul>
        {historicalTrash && historicalTrash.length < countTrash && (
          <Button onClick={loadMoreTrash}>Load More</Button>
        )}
      </Modal>
      <Modal isOpen={modalOpenCanister} onClose={toggleCanisterModal}>
        <h3 style={{ fontSize: "38px" }}><strong>Historical Canister Data </strong><em>Line {line.lineId}</em></h3>
        <ul>
          {historicalCanister && historicalCanister.map((canister, index) => (
            <div className="pair-container" key={index}>
              <li key={index}><span><em>canister replaced date: </em> <strong>{new Date(canister.date).toLocaleDateString()}</strong></span></li>
            </div>
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
