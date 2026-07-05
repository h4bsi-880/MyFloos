import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./index.css";
import InstallPrompt from "./components/InstallPrompt";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", gap: 16, background: "#0f172a" }}>
        <svg width="56" height="56" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="85" fill="#0f172a" stroke="#c8102e" strokeWidth="10" />
          <circle cx="100" cy="100" r="68" fill="none" stroke="#00732f" strokeWidth="6" />
          <path d="M62 128 L88 88 L112 106 L146 62" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M146 62 L146 88 M146 62 L120 62" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ opacity: 0.7, fontSize: 14 }}>Loading FloosTrack...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login />
        <InstallPrompt />
      </>
    );
  }

  return (
    <>
      <Home user={user} onLogout={() => signOut(auth)} />
      <InstallPrompt />
    </>
  );
}
