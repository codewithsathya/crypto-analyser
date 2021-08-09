const ta = require("ta.js");
const { getCandles } = require("./services/binanceCandles");
const zeroSlopeEma = require("./strategies/zeroSlopeEma");
const emaCrossover = require("./strategies/emaCrossover");
const macdStrategy = require("./strategies/macdStrategy");

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
  "ALICE",
];

function getClosedPrices(candles) {
  return candles.map((candle) => parseFloat(parseFloat(candle[4]).toFixed(20)));
}

function getHighPrices(candles) {
  return candles.map((candle) => parseFloat(parseFloat(candle[2]).toFixed(20)));
}

function getSlicedLastArray(arr, noOfElementsRequired) {
  return arr.slice(arr.length - noOfElementsRequired, arr.length);
}

function getCandlesAsArrays(arr) {
  return arr.map((candle) => {
    return [candle[1], candle[2], candle[3], candle[4]];
  });
}

async function show(coin, i) {
  let extraCandles = 1000;
  let emaLength1 = 25;
  let emaLength2 = 5;
  let day = 26;

  // for (let day = 1; day < 22; day++) {
  let candles = await getCandles(
    coin,
    "1h",
    `07/01/2021 12:50:00 PM`,
    `07/30/2021 07:00:00 AM`,
    extraCandles
  );
  let length = candles.length - extraCandles;

  let closedPricesArray = getClosedPrices(candles);
  let ema = (await ta.sma(closedPricesArray, emaLength1)).map((value) =>
    value.toFixed(20)
  );

  let ema2 = (await ta.sma(closedPricesArray, emaLength2)).map((value) =>
    value.toFixed(20)
  );

  let slicedClosedPrices = getSlicedLastArray(closedPricesArray, length);
  let slicedEma1 = getSlicedLastArray(ema, length);
  let slicedEma2 = getSlicedLastArray(ema2, length);

  let profit = emaCrossover(slicedClosedPrices, slicedEma2, slicedEma1);
  console.log(
    coin,
    profit.amount,
    profit.count,
    profit.noOfCoinsStart,
    profit.noOfCoinsEnd,
    i
  );
  // }
}

// coinsArray.forEach((coin) => show(coin));
for (let i = 10; i < 100; i++) {
  // show("BTCDOWN", i);
}

show("BNBUSDT");

async function show1(symbol, timeFrame) {
  let extraCandles = 1000;
  let candles = await getCandles(
    symbol,
    timeFrame,
    `05/01/2021 12:50:00 PM`,
    `05/30/2021 07:00:00 AM`,
    extraCandles
  );
  let length = candles.length - extraCandles;
  let closedPricesArray = getClosedPrices(candles);
  let highPricesArray = getHighPrices(candles);
  let strategyReport = await macdStrategy(
    closedPricesArray,
    highPricesArray,
    length
  );
  console.log(strategyReport);
}

// show("ICPUSDT", "5m");
