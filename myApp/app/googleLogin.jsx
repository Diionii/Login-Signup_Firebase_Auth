import React, { useEffect } from "react";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginIOS() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "690960010472-79ique3thtvdq143fofvnd6ms9ifshpd.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("Successfully signed in with Google on iOS!");
        })
        .catch((error) => {
          console.error("Error signing in: ", error);
        });
    }
  }, [response]);

  return <Button title="Sign in with Google (iOS)" onPress={() => promptAsync()} />;
}
