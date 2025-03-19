export function formatDate(date?: string) {
  // eslint-disable-next-line prefer-const
  let d = date ? new Date(date) : new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    // eslint-disable-next-line prefer-const
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
