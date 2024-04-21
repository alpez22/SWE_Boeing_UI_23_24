import React, { useState, useEffect } from 'react';
import LineCard from '../components/LineCard';
import useSWR from 'swr';
import axios from 'axios';

function PepsiApp() {
  const Lines = useSWR("http://localhost:3000/lines", (url) => axios.get(url).then(res => res.data));
  const CanisterChanges = useSWR("http://localhost:3000/lines", (url) => axios.get(url).then(res => res.data));

  console.log("Lines data: ");
  console.log(Lines.data)

  if (!Lines.data) {
    return <div><h1>Loading...</h1></div>;
  }

  return (
    <div className="app-container">
      <div className="lines-wrapper">
        {Lines.data.map(line => 
          <LineCard key={line.lineId} line={line} />)}
      </div>
    </div>
  );
}

export default PepsiApp;
