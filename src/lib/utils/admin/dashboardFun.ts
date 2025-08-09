import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subMonths,
  subDays,
} from "date-fns";

export const getPresetRange = (key: string) => {
  const today = new Date();
  switch (key) {
    case "today":
      return { from: startOfDay(today), to: endOfDay(today) };
    case "last7":
      return { from: subDays(today, 6), to: endOfDay(today) };
    case "thisMonth":
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case "lastMonth":
      const lastMonth = subMonths(today, 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    default:
      return { from: startOfMonth(today), to: endOfMonth(today) };
  }
};
