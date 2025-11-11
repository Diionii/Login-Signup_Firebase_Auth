import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig";

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth(app);

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // 🧠 Kontrollo statusin e përdoruesit (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || user.displayName || "User");
      } else {
        router.replace("/login");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.email}>{userEmail}</Text>

      <Button title="Logout" onPress={handleLogout} color="#E53935" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 15,
    color: "#333",
  },
  email: { 
    fontSize: 18, 
    marginBottom: 30, 
    color: "gray" 
  },
});
