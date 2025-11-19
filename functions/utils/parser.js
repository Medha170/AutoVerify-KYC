/**
 * Helper Function: Parses raw text to find Name and ID No.
 * This mocks the "smart" extraction by looking for keywords.
 * @param {string} text - The raw text returned by Google Vision AI
 * @return {object} - Cleaned JSON object with name, dob, etc.
 */
function parseKYCData(text) {
  const data = {
    name: "Not Detected",
    idNumber: "Not Detected",
    dob: "Not Detected",
  };

  if (!text) return data;

  const lines = text.split("\n");
  let potentialNameFallback = null;

  lines.forEach((line, index) => {
    // Only process English lines
    if (!isEnglishLine(line)) return;

    const lowerLine = line.toLowerCase();

    // --- 1. EXPLICIT NAME DETECTION (Best Match) ---
    const nameKeywords = ["name", "given name", "fn", "full name",
      "first name", "to"];
    const hasNameKeyword = nameKeywords.some((keyword) =>
      lowerLine.includes(keyword),
    );

    if (hasNameKeyword && data.name === "Not Detected") {
      const parts = line.split(/[:\-\\.]/);
      if (parts.length > 1 && parts[1].trim().length > 2) {
        data.name = parts[1].trim();
      } else if (lines[index + 1]) {
        const nextLine = lines[index + 1].trim();
        if (nextLine && !nextLine.includes(":")) {
          data.name = nextLine;
        }
      }
    }

    // --- 2. IMPLICIT NAME DETECTION (Fallback) ---
    // Look for the first valid line that isn't a header, date, or ID.
    if (!potentialNameFallback && data.name === "Not Detected") {
      // Common headers to ignore
      const isHeader = [
        "republic",
        "government",
        "union",
        "state",
        "license",
        "card",
        "identity",
        "dept",
        "department",
        "ministry",
      ].some((h) => lowerLine.includes(h));

      // Ignore lines with numbers (dates, IDs, addresses usually have numbers)
      const hasNumbers = /\d/.test(line);

      // Ignore short lines or labels
      const isTooShort = line.trim().length < 3;
      const isLabel = line.includes(":");

      // If it passes all checks, it's likely the name!
      if (
        !isHeader &&
        !hasNumbers &&
        !isTooShort &&
        !isLabel &&
        !hasNameKeyword
      ) {
        // Double check it has at least some letters (not just symbols)
        if (/[a-zA-Z]/.test(line)) {
          potentialNameFallback = line.trim();
        }
      }
    }

    // --- 3. DOB DETECTION ---
    if (
      (lowerLine.includes("dob") ||
        lowerLine.includes("birth") ||
        lowerLine.includes("date")) &&
      data.dob === "Not Detected"
    ) {
      const parts = line.split(/[:\s]/);
      parts.forEach((part) => {
        if (part.match(/\d{2}[\\/\\-]\d{2}[\\/\\-]\d{4}/)) {
          data.dob = part;
        }
      });
    }

    // --- 4. ID NUMBER DETECTION ---
    if (data.idNumber === "Not Detected") {
      // Matches 1234 5678 9012 (Aadhar)
      if (line.match(/\d{4}\s\d{4}\s\d{4}/)) {
        data.idNumber = line.trim();
      } else if (line.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)) {
        data.idNumber = line.trim();
      }
    }
  });

  // Use the fallback if no keyword-based name was found
  if (data.name === "Not Detected" && potentialNameFallback) {
    data.name = potentialNameFallback;
  }

  return data;
}

/**
 * Checks whether a line contains any English alphabet characters.
 * @param {string} line - A single line of text to evaluate.
 * @return {boolean} True if the line contains at least one English letter.
 */
function isEnglishLine(line) {
  return /[a-zA-Z0-9]/.test(line);
}

module.exports = {parseKYCData};
