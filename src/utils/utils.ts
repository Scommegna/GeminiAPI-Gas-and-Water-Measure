import bcrypt from "bcrypt";

import "dotenv/config";

export function isTodayDayOfPayment() {
  const today = new Date();
  return today.getDate() === 7;
}

export function checkMeasureType(measure_type: string) {
  return (
    measure_type.toUpperCase() === "WATER" ||
    measure_type.toUpperCase() === "GAS"
  );
}

export async function hashPassword(password: string) {
  const saltRounds = Number(process.env.SALT_ROUNDS);

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
}

export async function compareHashedPassword(
  plainPassword: string,
  hashedPassword: string
) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);

  return match;
}

export function isValidEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function isValidCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, "");

  // Check if the CPF has 11 digits or is a sequence of the same digit
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calculate the first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstCheckDigit = (sum * 10) % 11;
  if (firstCheckDigit === 10) firstCheckDigit = 0;

  // Calculate the second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondCheckDigit = (sum * 10) % 11;
  if (secondCheckDigit === 10) secondCheckDigit = 0;

  // Check if calculated check digits match the actual check digits
  return (
    firstCheckDigit === parseInt(cpf.charAt(9)) &&
    secondCheckDigit === parseInt(cpf.charAt(10))
  );
}

export function formatDate(date: Date, separator: string) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${separator}${month}${separator}${day}`;
}

export function extractDate(text: string) {
  const datePart = text.split("-").pop();

  return datePart?.replace(/\?/g, "-");
}

export function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

export function getValueInMoney(measuredValue: number, measure_type: string) {
  if (measure_type === "WATER") {
    return (measuredValue * 1.785).toFixed(2);
  } else if (measure_type === "GAS") {
    return (measuredValue * 2.076).toFixed(2);
  }
}

export function formatStringToObject(inputString: string) {
  const cleanedString = inputString.trim();

  const pairs = cleanedString.split(",");

  const formattedObject: { [key: string]: string } = {};
  pairs.forEach((pair) => {
    const [key, value] = pair.split("/");
    formattedObject[key] = value;
  });

  return formattedObject;
}
