import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
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

  // 🔹 Login with Email/Password
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
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Login setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "690960010472-qp7s47lccr4bb6674rnq4uttr7nptug1.apps.googleusercontent.com",
  });

  useEffect(() => {
    const handleGoogleAuth = async () => {
      if (response?.type === "success") {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          await signInWithCredential(auth, credential);
          console.log("✅ Google login successful");
          router.replace("/home");
        } catch (error) {
          console.error("Google login error:", error);
          setError("Google login failed.");
        }
      }
    };

    handleGoogleAuth();
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In to Your Account</Text>

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

      <Text style={{ marginVertical: 20, fontWeight: "600", color: "#666" }}>or</Text>

      <Button
        title="Log In with Google"
        onPress={() => promptAsync()}
        color="#DB4437"
        disabled={!request || loading}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
}

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
