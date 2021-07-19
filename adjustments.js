const cardExists = (arduinoId) => {
  return true;
}

const plantIds = (arduinoId) => {
  return [11, 12, 13, 14];
}

const adjustments = (arduinoId, currentStatus) => {
  //compute necessary changes and generate result
  //return fake result for the moment
  const result = {
    success: true,
    changes: [
      {
        plantID: 11,
        temperature: -4,
        moisture: 8,
        nitrogen: 3,
        phosphorus: 8,
        potassium: 5,
	oxygen: 14,
	carbon: 2,
        light: 0,
      },
      {
        plantID: 12,
        temperature: -4,
        moisture: 8,
        nitrogen: 3,
        phosphorus: 8,
        potassium: 5,
	oxygen: 14,
	carbon: 2,
        light: 0,
      },
      {
        plantID: 13,
        temperature: -4,
        moisture: 8,
        nitrogen: 3,
        phosphorus: 8,
        potassium: 5,
	oxygen: 14,
	carbon: 2,
        light: 0,
      },
      {
        plantID: 14,
        temperature: -4,
        moisture: 8,
        nitrogen: 3,
        phosphorus: 8,
        potassium: 5,
	oxygen: 14,
	carbon: 2,
        light: 0,
      }
    ],
  };
  return result;
};

module.exports = { cardExists, plantIds, adjustments }
