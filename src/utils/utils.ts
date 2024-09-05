export function hasOneMonthPassed(date: Date | undefined) {
  if (!date) return;

  const today = new Date();
  const oneMonthAgo = new Date(today);

  oneMonthAgo.setMonth(today.getMonth() - 1);

  return date <= oneMonthAgo;
}
