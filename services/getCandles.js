const axios = require("axios");

const minute = 60000;
const limit = 1000;
let baseUrl = "https://api.binance.com";
let apiUrl = baseUrl + "/api/v3";

function getKlinesApiUrl(symbol, timeFrame, startTime, endTime) {
  return `${apiUrl}/klines?symbol=${symbol}&interval=${timeFrame}&startTime=${startTime}&endTime=${endTime}&limit=1000`;
}

async function getCandles(symbol, timeFrame, startTime, endTime) {
  const { data: candles } = await axios.get(
    getKlinesApiUrl(symbol, timeFrame, startTime, endTime)
  );
  return candles;
}

async function getLastCandles(symbol, timeFrame, noOfCandles) {
  let presentTime = new Date().getTime();
  let endTime = Math.floor(presentTime / minute) * minute;
  let startTime = endTime - (noOfCandles - 1) * minute;
  if (noOfCandles <= limit) {
    return await getCandles(symbol, timeFrame, startTime, endTime);
  } else {
    let candles = [];
    let partition = 0;
    while (partition + limit < noOfCandles) {
      candles = [
        ...candles,
        ...(await getCandles(
          symbol,
          timeFrame,
          startTime + partition * minute,
          startTime + (partition + limit - 1) * minute
        )),
      ];
      partition += limit;
    }
    candles = [
      ...candles,
      ...(await getCandles(
        symbol,
        timeFrame,
        startTime + partition * minute,
        endTime
      )),
    ];
    return candles;
  }
}

module.exports = {
	getLastCandles
};
