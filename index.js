const { getLastCandles } = require("./services/getCandles");
const { getMovingAvgArray } = require("./services/movingAverage");

const coinsArray = [
  "BTC",
  "ETH",
  "ADA",
  "BNB",
  "XRP",
  "DOGE",
  "ETC",
  "MATIC",
  "SOL",
  "DOT",
  "ICP",
  "VET",
  "SHIB",
  "FIL",
  "LINK",
  "AAVE",
  "COMP",
  "THETA",
  "LTC",
  "EOS",
  "TRX",
  "RUNE",
  "AXS",
  "KSM",
  "FORTH",
  "UNI",
  "BCH",
  "IOST",
  "GRT",
  "ATOM",
  "CAKE",
  "SXP",
  "CHZ",
  "TFUEL",
  "CELO",
  "NEO",
  "IOTX",
  "BAKE",
  "ZEC",
  "XLM",
  "SLP",
  "LUNA",
  "NEAR",
  "MDX",
  "FET",
  "FTM",
  "ROSE",
  "XMR",
  "EGLD",
  "ONT",
  "HBAR",
  "SUSHI",
  "WIN",
  "KAVA",
  "BTT",
  "ENJ",
  "ANT",
  "CRV",
  "IOTA",
  "FTT",
  "DENT",
  "STMX",
  "OMG",
  "DOCK",
  "WAVES",
  "QTUM",
  "MKR",
  "STRAX",
  "1INCH",
  "DASH",
  "ZIL",
  "AVAX",
  "HOT",
  //
  "BAT",
];
const quote = "USDT";
let minute = 60000;

async function show(symbol, i) {
  let time = 24 * 60;
  let presentTime = new Date().getTime();
  const candles = await getLastCandles(symbol, "5m", 1000, presentTime);
  let arr = candles.map((item) => {
    return parseFloat(item[1]);
  });

  let size = time - 100;

  let max = 0,
    a = 0,
    b = 0,
    count = 0;
  for (let i = 5; i < 99; i++) {
    for (let j = i + 1; j < 100; j++) {
      let movingAvg1 = getMovingAvgArray(arr, size, i);
      let movingAvg2 = getMovingAvgArray(arr, size, j);
      let slicedArr = arr.slice(arr.length - size, arr.length);
      let profit = calculateProfit(movingAvg1, movingAvg2, 1000, slicedArr);
      if (profit.total > max) {
        max = profit.total;
        count = profit.count;
        a = i;
        b = j;
      }
    }
  }
  console.log(max, a, b, count, symbol);

  // let movingAvg1 = getMovingAvgArray(arr, 97, 1);
  // let movingAvg2 = getMovingAvgArray(arr, 97, 98);
  // let slicedArr = arr.slice(arr.length - 97, arr.length);
  // let profit = calculateProfit(movingAvg1, movingAvg2, 1000, slicedArr);
  // console.log(profit.total, profit.count, symbol, i);
}

async function show1(symbol, endTime, timeLength) {
  let time = timeLength * 60;
  let presentTime = new Date().getTime();
  const candles = await getLastCandles(
    symbol,
    "15m",
    1000,
    presentTime - 24 * 60 * 60 * 1000 * 0
  );
  let arr = candles.map((item) => {
    return parseFloat(item[1]);
  });

  // let size = time - 200;

  //for for
  // let max = 0;
  // let ind = 0;
  // for (let i = 10; i < 150; i++) {
  //   let movingAvg = getMovingAvgArray(arr, 97, i);
  //   let slicedArr = arr.slice(arr.length - 97, arr.length);
  //   let profit = calculateProfit1(movingAvg, slicedArr, 1000);
  //   if(profit.total > max){
  //     max = profit.total;
  //     ind = i;
  //   }
  // }
  // console.log(max, symbol, endTime, "MA: " + ind);
  //part 2
  let movingAvg = getMovingAvgArray(arr, 97, 25);
  let slicedArr = arr.slice(arr.length - 97, arr.length);
  let profit = calculateProfit1(movingAvg, slicedArr, 1000);
  console.log(profit, symbol, endTime);
}

// showme("SLPUSDT");

async function showme(symbol) {
  try {
    let candles = await getLastCandles(
      symbol,
      "5m",
      97 * 3 * 2,
      new Date().getTime()
    );
    let haCandles = getHeikinAshi(candles);
    candles.splice(0, candles.length / 2);
    haCandles.splice(0, haCandles.length / 2);
    let result = calcProf(candles, haCandles, 1000);
    console.log(result, symbol);
  } catch (error) {
    console.error(symbol, "Error");
  }
}

function calcProf(candles, haCandles, principal) {
  let bought = false;
  let usdt = principal;
  let noOfCoins = 0;
  let count = 0;
  for (let i = 1; i < candles.length; i++) {
    if (haCandles[i].status !== haCandles[i - 1].status) {
      if (
        haCandles[i].status === "green" &&
        !bought &&
        haCandles[i].open === haCandles[i].low
      ) {
        // buy
        bought = true;
        noOfCoins = (0.999 * usdt) / parseFloat(candles[i][4]);
        usdt = 0;
        count++;
        console.log(
          noOfCoins * parseFloat(candles[i][4]),
          "Price = ",
          parseFloat(candles[i][4]),
          new Date(candles[i][0])
        );
      } else if (haCandles[i].status === "red" && bought) {
        // sell
        bought = false;
        usdt = 0.999 * noOfCoins * parseFloat(candles[i][4]);
        noOfCoins = 0;
        count++;
        console.log(
          usdt,
          "Price = ",
          parseFloat(candles[i][4]),
          new Date(candles[i][0])
        );
      }
    }
  }
  return usdt
    ? { total: usdt, count }
    : { total: noOfCoins * candles[candles.length - 1][4], count };
}

function calcProf1(candles, haCandles, principal) {
  let bought = false;
  let usdt = principal;
  let noOfCoins = 0;
  let count = 0;
  for (let i = 1; i < candles.length; i++) {
    let diff = haCandles[i].close - haCandles[i].open;
    let prevDiff = haCandles[i - 1].close - haCandles[i - 1].open;

    if (
      haCandles[i].status === "green" &&
      !bought &&
      diff >= prevDiff
    ) {
      // buy
      bought = true;
      noOfCoins = (0.999 * usdt) / parseFloat(candles[i][4]);
      usdt = 0;
      count++;
      console.log(
        noOfCoins * parseFloat(candles[i][4]),
        "Price = ",
        parseFloat(candles[i][4]),
        new Date(candles[i][0])
      );
    } else if (bought && diff < prevDiff) {
      // sell
      bought = false;
      usdt = 0.999 * noOfCoins * parseFloat(candles[i][4]);
      noOfCoins = 0;
      count++;
      console.log(
        usdt,
        "Price = ",
        parseFloat(candles[i][4]),
        new Date(candles[i][0])
      );
    }
  }
  return usdt
    ? { total: usdt, count }
    : { total: noOfCoins * candles[candles.length - 1][4], count };
}

function cp(candles, haCandles, principal) {
  let bought = false;
  let usdt = principal;
  let noOfCoins = 0;
  let count = 0;
  let len = candles.length;
  for (let i = 1; i < len; i++) {}
}

function getHeikinAshi(candles) {
  let result = [];
  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    let haCandle = {};

    let open = parseFloat(candle[1]),
      high = parseFloat(candle[2]),
      low = parseFloat(candle[3]),
      close = parseFloat(candle[4]);

    if (i > 0) {
      haCandle.open =
        (parseFloat(result[i - 1].open) + parseFloat(result[i - 1].close)) / 2;
      haCandle.close = (open + high + low + close) / 4;
    } else {
      haCandle.open = open;
      haCandle.close = close;
    }
    haCandle.high = Math.max(high, haCandle.open, haCandle.close);
    haCandle.low = Math.min(low, haCandle.open, haCandle.close);
    haCandle.status = haCandle.close > haCandle.open ? "green" : "red";
    result.push(haCandle);
  }
  return result;
}

function calculateProfit3(openingPrices, closingPrices) {}

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
//   showme(value + quote);
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
//     await show1("AXS" + quote, i, 24);
//   }
// }

// disp();
// disp1();

// show("BNB" + quote, 0);
show1("AXS" + quote, 0, 24);
