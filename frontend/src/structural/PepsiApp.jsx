import React, { useState, useEffect } from 'react';
import LineCard from '../components/LineCard';
import { fetchLines } from '../services/apiService';

function PepsiApp() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Assume fetchLines is a function you will create in apiService.js
    // It fetches all line data and updates the state
    fetchLines().then(setLines);
  }, []);

  return (
    <div>
      {lines.map(line => <LineCard key={line.lineNum} line={line} />)}
    </div>
  );
}

export default PepsiApp;
