import { useState, useEffect } from "react";
import Logo from "./Logo";
import "../styles/loading.css";

const MESSAGES = [
  "Counting your Rials...",
  "Fetching your Floos...",
  "Balancing the books...",
  "Adding up the numbers...",
  "Almost there...",
];

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-logo">
        <Logo size={72} />
      </div>
      <p className="loading-message">{MESSAGES[messageIndex]}</p>
    </div>
  );
}
