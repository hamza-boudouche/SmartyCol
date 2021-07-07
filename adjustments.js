const adjustments = (currentStatus) => {
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
    ],
  };
  return result;
};

module.exports = {adjustments}
