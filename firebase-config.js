// Firebase Configuration
// To use Firebase, replace the config values with your Firebase project credentials
// Get these from: https://console.firebase.google.com/

const firebaseConfig = {
    // IMPORTANT: Replace these with your actual Firebase credentials
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Check if Firebase is properly configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Initialize Firebase (only if configured)
let firebase, db, storage;
if (isFirebaseConfigured) {
    // Import Firebase SDK - Add to your HTML: 
    // <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
    // <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"></script>
    // <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js"></script>
    
    console.log("Firebase is configured but SDK not loaded. Add Firebase scripts to HTML.");
}

// Sync mixes to Firebase
async function syncToFirebase(mixes) {
    if (!isFirebaseConfigured) {
        console.log("Firebase not configured - using local storage only");
        return;
    }

    try {
        // This would sync to Firestore in a real implementation
        console.log("Syncing mixes to Firebase...", mixes);
    } catch (error) {
        console.error("Firebase sync error:", error);
    }
}

// Load mixes from Firebase
async function loadFromFirebase() {
    if (!isFirebaseConfigured) {
        return [];
    }

    try {
        // This would load from Firestore in a real implementation
        console.log("Loading mixes from Firebase...");
        return [];
    } catch (error) {
        console.error("Firebase load error:", error);
        return [];
    }
}

// Firebase Setup Instructions (for user reference)
const firebaseSetupGuide = `
=== FIREBASE SETUP GUIDE ===

To enable cloud storage and sync for your mixtapes:

1. Go to https://console.firebase.google.com/
2. Click "Create a new project" or select existing
3. Project Settings > Service Accounts
4. Copy your Web API credentials
5. Replace the values in js/firebase-config.js:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

6. Add to admin.html <head>:
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"><\/script>
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"><\/script>
   <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js"><\/script>

7. Create Firestore database with rules:
   - Collection: "mixes"
   - Storage bucket: for audio/video files

Currently: Using localStorage (works offline, limited to ~5MB)
`;

console.log(firebaseSetupGuide);
