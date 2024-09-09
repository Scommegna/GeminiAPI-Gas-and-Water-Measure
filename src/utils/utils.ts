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
