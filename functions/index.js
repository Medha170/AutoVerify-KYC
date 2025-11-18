/**
 * Import function triggers from Firebase
 */
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Import the Google Cloud Vision library
const {ImageAnnotatorClient} = require("@google-cloud/vision");

// Import CORS to allow our React app to talk to this function
const cors = require("cors")({origin: true});

// Initialize the Vision AI Client
const client = new ImageAnnotatorClient();

/**
 * Cloud Function: extractData
 * Triggers via HTTP Request
 * 1. Receives a Base64 image from React.
 * 2. Sends it to Google Cloud Vision AI.
 * 3. Returns the extracted text as JSON.
 */
exports.extractData = onRequest(async (req, res) => {
  // Wrap the entire logic in CORS to prevent browser errors
  await cors(req, res, async () => {
    try {
      // 1. Check if the method is POST
      if (req.method !== "POST") {
        return res.status(405).send({message: "Method Not Allowed"});
      }

      // 2. Get the Base64 image string from the request body
      const {image} = req.body;

      if (!image) {
        return res.status(400).send({message: "No image provided"});
      }

      // 3. Prepare the request for Cloud Vision
      // We remove the "data:image/jpeg;base64," prefix if it exists
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

      const request = {
        image: {
          content: base64Data,
        },
        features: [
          {
            type: "TEXT_DETECTION", // We want to read text
          },
        ],
      };

      // 4. Call the AI
      logger.info("Sending image to Cloud Vision API...");
      const [result] = await client.annotateImage(request);
      const fullText = result.fullTextAnnotation ?
      result.fullTextAnnotation.text : "";
      logger.info("AI Extraction Complete.");

      // 5. Parse the messy text to find "Name" and "DOB"
      // (This is simple logic for the hackathon demo)
      const extractedData = parseKYCData(fullText);

      // 6. Return the clean data to React
      return res.status(200)
          .json({success: true, data: extractedData, rawText: fullText});
    } catch (error) {
      logger.error("Error in extractData:", error);
      return res.status(500).json({success: false, error: error.message});
    }
  });
});

/**
 * Helper Function: Parses raw text to find Name and ID No.
 * This mocks the "smart" extraction by looking for keywords.
 *
 * @param {string} text - Raw extracted text from OCR to parse.
 * @return {{name: string, idNumber: string, dob: string}} Parsed KYC fields.
 */
function parseKYCData(text) {
  // Default values if we can't read it
  const data = {
    name: "Not Detected",
    idNumber: "Not Detected",
    dob: "Not Detected",
  };

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
    if ((lowerLine.includes("dob") ||
        lowerLine.includes("birth")) &&
        data.dob === "Not Detected") {
      const parts = line.split(/[:\s]/);
      // Look for a date pattern in the parts
      parts.forEach((part) => {
        if (part.match(/\d{2}\/\d{2}\/\d{4}/)) {
          data.dob = part;
        }
      });
    }

    // Fallback: If we see an ID pattern (e.g., 4-4-4 digits for Aadhar)
    if (line.match(/\d{4}\s\d{4}\s\d{4}/)) {
      data.idNumber = line.trim();
    }
  });

  return data;
}
