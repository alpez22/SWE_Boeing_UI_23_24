import React, { useState, useEffect } from 'react';
import LineCard from '../components/LineCard';
import useSWR from 'swr';
import axios from 'axios';

/* TRASH in {grams} && CANISTER in {grams per second} */
/* empty trash can = 3 lbs */
/* full trash can = 16 lbs */
const TRASH_RED_INDICATOR = 6800; //15lbs out of 16 lbs
const TRASH_ORANGE_INDICATOR = 5800; //13lbs out of 16 lbs
const TRASH_GREEN_INDICATOR = 0;
const CANISTER_RED_INDICATOR = 0.034; //16lbs per 60 hours
const CANISTER_ORANGE_INDICATOR = 0.027; //13lbs per 60 hours
const CANISTER_GREEN_INDICATOR = 0.0;

function PepsiApp() {
  const Lines = useSWR("http://localhost:3000/lines", (url) => axios.get(url).then(res => res.data));

  console.log("Lines data: ");
  console.log(Lines.data)

  if (!Lines.data) {
    return <div><h1>Loading...</h1></div>;
  }

  //Utility function to determine indicator color
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

  //Trash Indicator Colors
  const colorWeightPriority = {
    red: 3,
    orange: 2,
    green: 1,
    blue: 0, // Assuming blue is the least priority color
  };
  //Canister Indicator Colors
  const colorWasteRatePriority = {
    red: 3,
    orange: 2,
    green: 1,
    blue: 0, // Assuming blue is the least priority color
  };

  // Sort the lines based on weight and wasteRate indicators
  const sortedLines = [...Lines.data].sort((a, b) => {
    const weightColorA = getIndicatorColor(a.weight, TRASH_RED_INDICATOR, TRASH_ORANGE_INDICATOR, TRASH_GREEN_INDICATOR);
    const weightColorB = getIndicatorColor(b.weight, TRASH_RED_INDICATOR, TRASH_ORANGE_INDICATOR, TRASH_GREEN_INDICATOR);
    const wasteRateColorA = getIndicatorColor(a.wasteRate, CANISTER_RED_INDICATOR, CANISTER_ORANGE_INDICATOR, CANISTER_GREEN_INDICATOR);
    const wasteRateColorB = getIndicatorColor(b.wasteRate, CANISTER_RED_INDICATOR, CANISTER_ORANGE_INDICATOR, CANISTER_GREEN_INDICATOR);

    const priorityA = colorWeightPriority[weightColorA] + colorWasteRatePriority[wasteRateColorA];
    const priorityB = colorWeightPriority[weightColorB] + colorWasteRatePriority[wasteRateColorB];

    return priorityB - priorityA;
  });

  return (
    <div className="app-container">
      <div className="lines-wrapper">
        {sortedLines.map(line => 
          <LineCard key={line.lineId} line={line} />
        )}
      </div>
    </div>
  );
}

export default PepsiApp;
