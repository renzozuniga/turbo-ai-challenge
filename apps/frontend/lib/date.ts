export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export function formatEditedTimestamp(iso: string): string {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours24 >= 12 ? "pm" : "am";
  const hours12 = hours24 % 12 || 12;
  return `${datePart} at ${hours12}:${minutes}${ampm}`;
}
