**AutoVerify KYC - AI-Powered Identity Verification**

AutoVerify is a next-generation KYC (Know Your Customer) solution designed to transform the onboarding process from a tedious form-filling exercise into a seamless, 60-second conversational experience.

Built for the GHCI Hackathon (2025).

## 🚀 **Key Features**

- **Conversational Interface**: A friendly AI agent guides users through the process, replacing static forms.

- **Real-Time AI Extraction**: Instantly extracts Name, DOB, and ID numbers from uploaded documents using Google Cloud Vision AI.

- **Instant Adjudication**: Automatically approves low-risk profiles in seconds.

- **Explainable Audit Trail**: Logs every step of the decision-making process for full compliance transparency.

- **Enterprise-Grade UI**: Clean, trustworthy, and responsive design built with Tailwind CSS.

## 🛠️ **Tech Stack**

- **Frontend**: React (Vite), Tailwind CSS

- **Backend**: Firebase Cloud Functions (Serverless)

- **AI Engine**: Google Cloud Vision API (OCR & Document Analysis)

- **Deployment**: Firebase Hosting / Vercel (Optional)

## 📂 **Project Structure**

autoverify-kyc/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # ChatWindow, StatusAuditWindow
│   │   └── utils/          # Chatbot Logic
│   └── ...
└── functions/              # Serverless Backend
    ├── index.js            # Cloud Function Entry Point
    └── utils/              # OCR Parsing Logic


## ⚡️ **How to Run Locally**

**Prerequisites**

- Node.js installed

- Firebase CLI installed (npm install -g firebase-tools)

1. **Setup Backend (Firebase Functions)**

cd functions
npm install
# Set up your firebase project credentials
firebase init
# Deploy the function to get your API URL
npm run deploy


2. **Setup Frontend (React)**

cd client
npm install


3. **Configure Environment**

Create a .env file in the client folder:

VITE_API_URL=[https://your-region-project.cloudfunctions.net/extractData](https://your-region-project.cloudfunctions.net/extractData)


4. **Run the App**

npm run dev


## 🧠 **AI & Architecture**

The system uses a hybrid architecture:

1. **Latency Optimization**: The chat interface uses local logic for instant (<100ms) responses to user queries.

2. **Security & Power**: Document processing is offloaded to a secure serverless function that leverages Google's Enterprise Vision AI for high-accuracy OCR.

Built with ❤️ by Medha Shree