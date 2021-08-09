const ProfitCalculator = require("../profitCalculator");

function zeroSlopeEma(closedPricesArray, emaArray) {
  let profitCalculator = new ProfitCalculator();
  let len = closedPricesArray.length;
  for (let i = 2; i < len; i++) {
    let diff = emaArray[i] - emaArray[i - 1];
    let prevDiff = emaArray[i - 1] - emaArray[i - 2];
    if (!profitCalculator.bought && diff > 0 && prevDiff > 0) {
      profitCalculator.buy(closedPricesArray[i]);
      // console.log(diff);
    } else if (profitCalculator.bought && diff < 0 && prevDiff < 0) {
      profitCalculator.sell(closedPricesArray[i]);
      // console.log(diff);
    }
  }
  if (profitCalculator.bought)
    profitCalculator.sell(closedPricesArray[len - 1]);
  return profitCalculator;
}

module.exports = zeroSlopeEma;
