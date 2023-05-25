export function sanitizeInput(input: string): string {
  let sanitizedInput = input;

  // Replace 'text:' with 'words'
  sanitizedInput = sanitizedInput.replace(/text:/gi, 'words');

  // Replace 'judge:' with 'mod'
  sanitizedInput = sanitizedInput.replace(/judge:/gi, 'mod');

  // Replace newline characters with space
  sanitizedInput = sanitizedInput.replace(/\r?\n|\r/g, ' ');

  // Replace multiple spaces with a single space
  sanitizedInput = sanitizedInput.replace(/\s\s+/g, ' ');

  // Remove leading and trailing spaces
  sanitizedInput = sanitizedInput.trim();

  return sanitizedInput;
}
