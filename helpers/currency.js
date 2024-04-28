function currencyFormat(num) {
  return Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(num);
}

module.exports = currencyFormat;
