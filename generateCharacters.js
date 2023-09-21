function generateTenDigitNumber() {
    const min = Math.pow(10, 9); // Minimum 10-digit number (1000000000)
    const max = Math.pow(10, 10) - 1; // Maximum 10-digit number (9999999999)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const randomTenDigitNumber = generateTenDigitNumber();

  module.exports = randomTenDigitNumber;