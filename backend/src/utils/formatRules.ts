export function formatArray(input: string[]): string {
  return input.map((item, index) => `${index + 1} ${item}`).join('\n');
}
