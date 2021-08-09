class ProfitCalculator {
  constructor(principal = 1000) {
    this.principal = principal;
  }

  checkPrice(price) {
    price = (typeof price !== "number") ? parseFloat(price) : price;
    if(!price) throw new Error("Invalid price");
    return price
  }

  principal = 500;
  base = 0;
  quote = this.principal;
  amount = this.principal;

  count = 0;
  fees = 0.00075
  bought = false;
  noOfCoinsStart = 0;
  started = false;
  noOfCoinsEnd = 0;

  buy(price) {
    price = this.checkPrice(price);
    this.base = (1 - this.fees) * this.quote / price;
    this.quote = 0;
    this.amount = this.base * price;
    this.count++;
    this.bought = true;
    if(!this.started){
      this.noOfCoinsStart = this.base;
      this.started = true;
    }
    // console.log(this.amount);
  }

  sell(price) {
    price = this.checkPrice(price);
    this.quote = (1 - this.fees) * this.base * price;
    this.noOfCoinsEnd = this.base;
    this.base = 0;
    this.amount = this.quote;
    this.count++;
    this.bought = false;
    // console.log(this.amount);
  }
}

module.exports = ProfitCalculator;