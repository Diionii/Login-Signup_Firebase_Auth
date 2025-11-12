import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./firebaseConfig";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 📧 Email + Password login
  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Login setup (Expo)
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "690960010472-qp7s47lccr4bb6674rnq4uttr7nptug1.apps.googleusercontent.com",
    androidClientId:
      "690960010472-fpt1h6d4e2ktp8p6gb4oel6pgog43l6g.apps.googleusercontent.com",
    webClientId:
      "690960010472-qvsus8fihh6r8nbm8i95j8t7vfvbrrf1.apps.googleusercontent.com",
  });

  // 🎯 Funksioni për Google login në web
  const handleGoogleWebLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("✅ Google login successful (web)");
      router.replace("/home");
    } catch (error) {
      console.error("Google login error (web):", error);
      setError("Google login failed on web.");
    }
  };

  // 📱 Funksioni për Google login në mobile
  useEffect(() => {
    const handleMobileGoogleLogin = async () => {
      if (response?.type === "success") {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          await signInWithCredential(auth, credential);
          console.log("✅ Google login successful (mobile)");
          router.replace("/home");
        } catch (error) {
          console.error("Google login error (mobile):", error);
          setError("Google login failed.");
        }
      }
    };
    handleMobileGoogleLogin();
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In to Your Account</Text>

      {/* Email login */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <Button
        title={loading ? "Logging in..." : "Log In with Email"}
        onPress={handleEmailLogin}
        disabled={loading}
      />

      <Text style={{ marginVertical: 20, fontWeight: "600", color: "#666" }}>
        or
      </Text>

      {/* Google Login */}
      <Button
        title="Log In with Google"
        color="#DB4437"
        onPress={
          Platform.OS === "web"
            ? handleGoogleWebLogin
            : () => promptAsync() // mobile
        }
        disabled={loading || (!request && Platform.OS !== "web")}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#333",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    padding: 12,
    fontSize: 16,
  },
  error: { color: "red", marginTop: 10, fontWeight: "600" },
  link: {
    color: "#007bff",
    marginTop: 25,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
