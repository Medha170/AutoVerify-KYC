/**
 * Helper Function: Parses raw text to find Name and ID No.
 * This mocks the "smart" extraction by looking for keywords.
 * @param {string} text - The raw text returned by Google Vision AI
 * @return {object} - Cleaned JSON object with name, dob, etc.
 */
function parseKYCData(text) {
  // Default values if we can't read it
  const data = {
    name: "Not Detected",
    idNumber: "Not Detected",
    dob: "Not Detected",
  };

  if (!text) return data;

  // Simple splitting by newline
  const lines = text.split("\n");

  // Logic: Look for common keywords on lines
  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();

    // If line contains "name", grab the next line or the rest of this line
    if (lowerLine.includes("name") && data.name === "Not Detected") {
      // Try to get the text AFTER "name" on the same line
      const parts = line.split(/name[:\s]/i);
      if (parts.length > 1 && parts[1].trim().length > 2) {
        data.name = parts[1].trim();
      } else if (lines[index + 1]) {
        // Otherwise take the NEXT line
        data.name = lines[index + 1].trim();
      }
    }

    // If line contains "dob" or "date of birth"
    if (
      (lowerLine.includes("dob") || lowerLine.includes("birth")) &&
      data.dob === "Not Detected"
    ) {
      const parts = line.split(/[:\s]/);
      // Look for a date pattern in the parts
      parts.forEach((part) => {
        if (part.match(/\d{2}\/\d{2}\/\d{4}/)) {
          data.dob = part;
        }
      });
    }

    // Fallback: If we see an ID pattern
    // (e.g., 4-4-4 digits for Aadhar or typical ID formats)
    if (line.match(/\d{4}\s\d{4}\s\d{4}/)) {
      data.idNumber = line.trim();
    }
  });

  return data;
}

module.exports = {parseKYCData};
