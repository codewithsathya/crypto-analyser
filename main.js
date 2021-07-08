const Binance = require("node-binance-api");
const binance = new Binance().options({
	APIKEY: 'Yz7DlNyA1nTLi1Qp8VYCmLV442eBWsnzPAYo8hkwrFqiSyy2RYMK2d8sR3zAPxQr',
	APISECRET: 'HOI4YuO2P39SlcOsKA1wtzXeR0YClfuqxrJ80vTqwi3AGWH3Fk3iob4UlmzUa2yM'
});

binance.balance((error, balances) => {
	if(error) return console.error(error);
	console.log(Object.keys(balances));
})
