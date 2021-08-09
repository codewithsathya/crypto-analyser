const ProfitCalculator = require("../profitCalculator");

function emaCrossover(closedPricesArray, fastMa, slowMa) {
  let profitCalculator = new ProfitCalculator();
  let len = closedPricesArray.length;
  let swit = false;
  for (let i = 0; i < len; i++) {
    if(fastMa[i] < slowMa[i]) swit = true;
    if (swit && !profitCalculator.bought && fastMa[i] > slowMa[i]) {
      profitCalculator.buy(closedPricesArray[i]);
    }else if(profitCalculator.bought && fastMa[i] < slowMa[i]){
      profitCalculator.sell(closedPricesArray[i]);
    }
  }
  if(profitCalculator.bought)
    profitCalculator.sell(closedPricesArray[len - 1]);
  return profitCalculator;
}

module.exports = emaCrossover;
