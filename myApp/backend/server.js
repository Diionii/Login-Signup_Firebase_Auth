// backend/server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

// Google Credentials
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "YOUR_CLIENT_SECRET";

// SIGUROHU QË KY SKEDAR ËSHTË NË TË NJËJTËN DOSJE!
const serviceAccount = require("./firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/exchange_google_token", async (req, res) => {
  const { code, redirectUri } = req.body;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) throw new Error(tokens.error_description);

    const decoded = await admin.auth().verifyIdToken(tokens.id_token);
    const uid = `google_${decoded.sub}`;
    const firebaseToken = await admin.auth().createCustomToken(uid);

    res.json({ firebase_token: firebaseToken });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Dëgjo në 0.0.0.0 për qasje nga telefoni
app.listen(3000, "0.0.0.0", () => {
  console.log("Backend në http://0.0.0.0:3000");
  console.log("Përdor IP-në tënde lokale: http://192.168.x.x:3000");
});