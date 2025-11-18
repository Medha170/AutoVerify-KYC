/**
 * Import function triggers from Firebase
 */
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Import the Google Cloud Vision library
const vision = require("@google-cloud/vision");

// Import CORS to allow our React app to talk to this function
const cors = require("cors")({origin: true});

// Import our custom parser logic
const {parseKYCData} = require("./utils/parser");

// Initialize the Vision AI Client
const client = new vision.ImageAnnotatorClient();

/**
 * Cloud Function: extractData
 * Triggers via HTTP Request
 */
exports.extractData = onRequest((req, res) => {
  // Wrap the entire logic in CORS to prevent browser errors
  cors(req, res, async () => {
    try {
      // 1. Check if the method is POST
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      // 2. Get the Base64 image string from the request body
      const {image} = req.body;

      if (!image) {
        return res.status(400).send("No image provided");
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

      // 5. Use our custom parser to clean the data
      const extractedData = parseKYCData(fullText);

      // 6. Return the clean data to React
      res.status(200).json({
        success: true,
        data: extractedData,
        rawText: fullText, // Sending raw text helps with debugging
      });
    } catch (error) {
      logger.error("Error in extractData:", error);
      res.status(500).json({success: false, error: error.message});
    }
  });
});
