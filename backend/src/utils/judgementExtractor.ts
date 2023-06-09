export function getRuleBroken(response: string): number | undefined {
  const lowerCaseResponse = response.toLowerCase();

  if (lowerCaseResponse.includes('yes') || response.trim() === '') {
    return undefined;
  }

  if (
    lowerCaseResponse.includes('no') ||
    lowerCaseResponse.includes('broke') ||
    lowerCaseResponse.includes('sorry')
  ) {
    // Matches 'no', 'broke', 'sorry' followed by any characters, then a number (integer or decimal)
    const regex = /.*?(-?\d+(\.\d+)?)/;
    const match = lowerCaseResponse.match(regex);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
  }
  return undefined;
}
