# Firebase Authentication - Google Only

Ky projekt implementon Firebase Authentication me Google Sign-In për iOS.

## Features

✅ **Email/Password** Authentication  
✅ **Google** Sign-In  

---

## Setup

### 1. Install Dependencies

```bash
cd myApp
npm install
```

### 2. Google Configuration

1. Shkо në [Google Cloud Console](https://console.cloud.google.com/)
2. Krijo OAuth 2.0 Client ID për iOS
3. Kopjo `iosClientId` në `app/authServices.js`:

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  iosClientId: "YOUR_IOS_CLIENT_ID",
});
```

4. Në Firebase Console, aktivizo **Authentication > Google**

### 3. Firebase Configuration

Siguro që `app/firebaseConfig.js` ka vlerat e sakta:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## Running the App

### iOS Simulator

```bash
npx expo start --ios
```

### Physical Device

```bash
npx expo start
# Scan QR code me Expo Go app
```

---

## Screens

- **`login.jsx`** - Login screen me Email/Password dhe Google buttons
- **`emailLogin.jsx`** - Email/Password sign-up dhe sign-in
- **`authServices.js`** - Google authentication functions

---

## File Structure

```
myApp/
├── app/
│   ├── _layout.tsx           # Root navigation
│   ├── login.jsx              # Login screen
│   ├── emailLogin.jsx         # Email/Password auth
│   ├── authServices.js        # Google auth functions
│   ├── firebaseConfig.js      # Firebase setup
│   └── (tabs)/                # App screens
├── app.json
├── package.json
└── README.md
```

---

## Functions

### Google Sign-In

```javascript
import { useGoogleAuth } from "./authServices";

export default function LoginScreen() {
  const { handleGoogleSignIn } = useGoogleAuth();
  
  const handleLogin = async () => {
    const user = await handleGoogleSignIn();
    // User is signed in
  };
}
```

### Sign Out

```javascript
import { handleSignOut } from "./authServices";

await handleSignOut();
```

---

## Troubleshooting

### Google Sign-In fails

```
Error: "Fingerprints don't match"
```

**Zgjidhje:** 
- Verify iOS Bundle ID në app.json matches Firebase project
- Check iosClientId në authServices.js

### Email/Password issues

- Verify Firebase Authentication is enabled
- Check email format is valid
- Password must be at least 6 characters

---

## Dependencies

```json
{
  "expo-auth-session": "~7.0.8",
  "expo-web-browser": "~15.0.9",
  "firebase": "^12.5.0"
}
```

---

## Resources

- [Firebase Docs](https://firebase.google.com/docs/auth)
- [Expo Google Auth](https://docs.expo.dev/guides/authentication/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Last Updated:** November 12, 2025
