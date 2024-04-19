import React, { useState, useEffect } from 'react';
import LineCard from '../components/LineCard';
import useSWR from 'swr';
import axios from 'axios';

function PepsiApp() {
  const Lines = useSWR("http://localhost:3000/lines", (url) => axios.get(url).then(res => res.data));

  console.log(Lines.data)

  if (!Lines.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {Lines.data.map(line => <LineCard key={line.lineId} line={line} />)}
    </div>
  );
}

export default PepsiApp;
