export function formatDict(obj: any, indent: number = 0): string {
  const pad = '  '.repeat(indent);
  
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return `${pad}${key}:\n${formatDict(value, indent + 1)}`;
      } else {
        return `${pad}${key}: ${value}`;
      }
    })
    .join('\n');
}
