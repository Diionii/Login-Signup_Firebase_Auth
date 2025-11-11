import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";

export default function SignupScreen() {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return setError("All fields are required!");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters!");
    }

    try {
      setLoading(true);
      console.log("🚀 Starting signup...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ User created:", user.uid);

      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      });
      console.log("✅ Saved to Firestore");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");

      Alert.alert("Success 🎉", "Your account has been created successfully!");
      await delay(1000);
      router.replace("/home");
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError("Failed to create account. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput 
        placeholder="First Name" 
        style={styles.input} 
        value={firstName} 
        onChangeText={setFirstName}
        editable={!loading}
      />
      <TextInput 
        placeholder="Last Name" 
        style={styles.input} 
        value={lastName} 
        onChangeText={setLastName}
        editable={!loading}
      />
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword}
        editable={!loading}
      />
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <Button 
        title={loading ? "Creating Account..." : "Sign Up"} 
        onPress={handleSignup} 
        disabled={loading} 
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Link href="/login" style={styles.link}>
        Already have an account? Log in
      </Link>
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
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 30,
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
  error: { 
    color: "red", 
    marginTop: 10,
    fontWeight: "600",
  },
  link: { 
    color: "blue", 
    marginTop: 20,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
