export function formateDate(date) {
  if (!date) return;

  return new Date(date).toLocaleDateString(process.env.Timezone);
}
