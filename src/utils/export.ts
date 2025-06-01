export function arrayToCsv<T>(data: T[], fields: { key: keyof T, label: string }[]): string {
  const header = fields.map(field => field.label).join(';');
  const rows = data.map(row =>
    fields.map(field => {
      const value = row[field.key];
      // Special handling for phone numbers to prevent scientific notation in Excel
      if (field.key === 'phone') {
        return `="'${String(value)}'"`;
      }

      if (typeof value === 'string' && (value.includes(';') || value.includes('"') || value.includes('\n'))) {
        // Escape double quotes and wrap in double quotes
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value !== undefined && value !== null ? String(value) : '';
    }).join(';')
  );
  return [header, ...rows].join('\n');
}

export function downloadCsv(csvString: string, filename: string): void {
  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  if (link.download !== undefined) { // feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 