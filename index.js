const { getLastCandles } = require("./services/getCandles");
const { getMovingAvgArray } = require("./services/movingAverage");

async function show() {
	let time = 19*60;
  const candles = await getLastCandles("ETHUSDT", "1m", time);
  let arr = candles.map((item) => {
    return parseFloat(item[4]);
  });

  let size = time - 100;
  // for (let i = 5; i < 100; i++) {
  let movingAvg1 = getMovingAvgArray(arr, size, 35);
	let movingAvg2 = getMovingAvgArray(arr, size, 80);
  let slicedArr = arr.slice(arr.length - size, arr.length);
  let profit = calculateProfit(movingAvg1,movingAvg2, 1000);
  console.log(profit);
  // }
}

function calculateProfit(closingPrices, movingAvg, principal) {
  let bought = false;
  let usdt = principal;
  let noOfCoins = 0;
  let count = 0;
  let len = closingPrices.length;
  for (let i = 0; i < len; i++) {
    if (!bought && closingPrices[i] > movingAvg[i]) {
      bought = true;
      noOfCoins = (0.999 * usdt) / closingPrices[i];
      usdt = 0;
      count++;
    } else if (bought && closingPrices[i] < movingAvg[i]) {
      bought = false;
      usdt = 0.999 * noOfCoins * closingPrices[i];
      noOfCoins = 0;
      count++;
    }
  }
	console.log(count);
  return usdt ? usdt : noOfCoins * closingPrices[len - 1];
}

show();
