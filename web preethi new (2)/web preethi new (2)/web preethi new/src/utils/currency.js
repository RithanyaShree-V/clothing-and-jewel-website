// Currency conversion utility
// 1 USD ≈ 83 INR (approximate conversion rate)
const USD_TO_INR = 83;

export const convertToINR = (usdPrice) => {
  return Math.round(usdPrice * USD_TO_INR);
};

export const formatPrice = (price) => {
  // If price is in USD, convert to INR
  const inrPrice = convertToINR(price);
  return `₹${inrPrice.toLocaleString('en-IN')}`;
};

export const formatPriceDirect = (inrPrice) => {
  return `₹${inrPrice.toLocaleString('en-IN')}`;
};

