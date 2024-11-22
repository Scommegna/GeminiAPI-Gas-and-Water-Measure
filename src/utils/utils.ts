import bcrypt from "bcrypt";

import "dotenv/config";

export function hasOneMonthPassed(date: Date | undefined) {
  if (!date) return;

  const today = new Date();
  const oneMonthAgo = new Date(today);

  oneMonthAgo.setMonth(today.getMonth() - 1);

  return date <= oneMonthAgo;
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
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
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
