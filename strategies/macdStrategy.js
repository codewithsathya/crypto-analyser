const macd = require("macd");
const ta = require("ta.js");
const sliceArr = require("../utils/sliceArray");

async function macdStrategy(closedPricesArray, highPricesArray, length) {
  let strategyReport = {
    noOfTrades: 0,
    noOfWins: 0,
    noOfLoses: 0,
    profit: 0,
  };

  let slicedClosedPrices = sliceArr(closedPricesArray, length);
  let slicedHighPrices = sliceArr(highPricesArray, length);
  let baseEma = await ta.ema(closedPricesArray, 200);
  let slicedBaseEma = sliceArr(baseEma, length);
  let macdData = macd(closedPricesArray);
  let macdLine = sliceArr(macdData.MACD, length);
  let signalLine = sliceArr(macdData.signal, length);
  let histogramLine = sliceArr(macdData.histogram, length);

  let tradePlaced = false;
  let noOfCoins = 0;
  let usdt = 1000;

  let sl = 0, tp = 0;

  for(let i = 1; i < length; i++){
    if(!tradePlaced && slicedClosedPrices[i] > slicedBaseEma[i] && macdLine[i] < 0 && signalLine[i] < 0 && histogramLine[i] > 0 && histogramLine[i - 1] <= 0){
      console.log(tradePlaced, slicedClosedPrices[i], slicedBaseEma[i], macdLine[i], signalLine[i], histogramLine[i], histogramLine[i - 1]);
      noOfCoins = (0.999) * usdt / slicedClosedPrices[i];
      sl = slicedBaseEma[i];
      tp = slicedClosedPrices[i] + (slicedClosedPrices[i] - slicedBaseEma[i]) * 1.5;
      tradePlaced = true;
      console.log("trade placed");
    }else if(tradePlaced){
      // console.log(slicedHighPrices[i], tp, sl);
      if(slicedHighPrices[i] >= tp){
        let total = 0.999 * noOfCoins * tp;
        strategyReport.profit += total - usdt;
        usdt = total;
        strategyReport.noOfTrades += 1;
        strategyReport.noOfWins += 1;
        tradePlaced = false;
        console.log("profit");
      }else if(slicedClosedPrices[i] <= sl){
        let total = 0.999 * noOfCoins * sl;
        strategyReport.profit += total - usdt;
        usdt = total;
        strategyReport.noOfTrades++;
        strategyReport.noOfLoses++;
        tradePlaced = false;
        console.log("loss");
      }
    }
  }
  return strategyReport;
}

module.exports = macdStrategy;
