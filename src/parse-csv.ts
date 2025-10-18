export function parseCSV(csvText: string, delimiter = ";") {
  const lines = csvText
    .trim()
    .split("\n")
    .map((line) => line.trim());
  const firstLine = lines.at(0);
  if (!firstLine) return [];
  const headers = firstLine.split(delimiter);
  return lines.slice(1).map((line) => {
    const values = line.split(delimiter);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });
    return record;
  });
}
