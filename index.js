const { getLastCandles } = require("./services/getCandles");
const { getMovingAvgArray } = require("./services/movingAverage");

const coinsArray = [
  "ADA",
  "ATOM",
  "PUNDIX",
  "CTSI",
  "BTT",
  "BAT",
  "BCH",
  "BNB",
  "BTC",
  "DASH",
  "DOGE",
  "DOT",
  "EOS",
  "ETC",
  "ETH",
  "IOST",
  "IOTA",
  "LTC",
  "NEO",
  "ONT",
  "QTUM",
  "TRX",
  "XMR",
  "XRP",
  "ZEC",
];
const quote = "USDT";
let minute = 15 * 60000;

async function show(symbol, i) {
  let time = 10 * 24 * 60;
  let presentTime = new Date().getTime();
  const candles = await getLastCandles(
    symbol,
    "15m",
    time,
    presentTime - 24 * 60 * i * minute
  );
  let arr = candles.map((item) => {
    return parseFloat(item[1]);
  });

  let size = time - 100;

  // let max = 0,
  //   a = 0,
  //   b = 0,
  //   count = 0;
  // for (let i = 5; i < 99; i++) {
  //   for (let j = i + 1; j < 100; j++) {
  //     let movingAvg1 = getMovingAvgArray(arr, size, i);
  //     let movingAvg2 = getMovingAvgArray(arr, size, j);
  //     let slicedArr = arr.slice(arr.length - size, arr.length);
  //     let profit = calculateProfit(movingAvg1, movingAvg2, 1000, slicedArr);
  //     if (profit.total > max) {
  //       max = profit.total;
  //       count = profit.count;
  //       a = i;
  //       b = j;
  //     }
  //   }
  // }
  // console.log(max, a, b, count, symbol);

  let movingAvg1 = getMovingAvgArray(arr, size, 97);
  let movingAvg2 = getMovingAvgArray(arr, size, 98);
  let slicedArr = arr.slice(arr.length - size, arr.length);
  let profit = calculateProfit(movingAvg1, movingAvg2, 1000, slicedArr);
  console.log(profit.total, profit.count, symbol, i);
}

async function show1(symbol, endTime, timeLength) {
  let time = timeLength * 60;
  let presentTime = new Date().getTime();
  const candles = await getLastCandles(
    symbol,
    "15m",
    time,
    presentTime - 24 * 60 * endTime * minute
  );
  let arr = candles.map((item) => {
    return parseFloat(item[1]);
  });

  let size = time - 200;

  //for for
  // let max = 0;
  for (let i = 10; i < 150; i++) {
    let movingAvg = getMovingAvgArray(arr, size, i);
    let slicedArr = arr.slice(arr.length - size, arr.length);
    let profit = calculateProfit1(movingAvg, slicedArr, 1000);
    console.log(profit, symbol, endTime, "MA: " + i);

  }
  //part 2
  // let movingAvg = getMovingAvgArray(arr, size, 50);
  // let slicedArr = arr.slice(arr.length - size, arr.length);
  // let profit = calculateProfit1(movingAvg, slicedArr, 1000);
  // console.log(profit, symbol, endTime);
}

function calculateProfit(closingPrices, movingAvg, principal, slicedArr) {
  let bought = false;
  let usdt = principal;
  let noOfCoins = 0;
  let count = 0;
  let len = closingPrices.length;
  for (let i = 0; i < len; i++) {
    if (!bought && closingPrices[i] > movingAvg[i]) {
      bought = true;
      noOfCoins = (0.999 * usdt) / slicedArr[i];
      usdt = 0;
      count++;
    } else if (bought && closingPrices[i] < movingAvg[i]) {
      bought = false;
      usdt = 0.999 * noOfCoins * slicedArr[i];
      noOfCoins = 0;
      count++;
    }
  }
  return usdt
    ? { total: usdt, count }
    : { total: noOfCoins * slicedArr[len - 1], count };
}

function calculateProfit1(movingAvg, slicedArr, principal) {
  let bought = false;
  let usdt = principal,
    noOfCoins = 0;
  let count = 0;
  let len = movingAvg.length;
  for (let i = 1; i < len; i++) {
    if (!bought && movingAvg[i] > movingAvg[i - 1]) {
      bought = true;
      noOfCoins = (0.999 * usdt) / slicedArr[i];
      usdt = 0;
      count++;
    } else if (bought && movingAvg[i] < movingAvg[i - 1]) {
      bought = false;
      usdt = 0.999 * noOfCoins * slicedArr[i];
      noOfCoins = 0;
      count++;
    }
  }
  return usdt
    ? { total: usdt, count }
    : { total: noOfCoins * slicedArr[len - 1], count };
}

// coinsArray.forEach((value) => {
//   show(value + quote, 0);
// });

// coinsArray.forEach((value) => {
//   show1(value + quote, 0, 24);
// });

async function disp() {
  for (let i = 0; i < 80; i++) {
    await show("ETC" + quote, i);
  }
}

// async function disp1() {
//   for (let i = 0; i < 80; i++) {
//     await show1("ETC" + quote, i, 24);
//   }
// }

// disp();
// disp1();

// show("ETC" + quote, 0);
show1("UNIUP" + quote, 0, 24);
