import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import Logo from "../components/Logo";
import "../styles/login.css";

export default function Login() {
  const { t } = useTranslation();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setLoading(false);
  }

  function friendlyError(code) {
    switch (code) {
      case "auth/email-already-in-use":
        return "That email is already registered. Try logging in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Incorrect email or password.";
      case "auth/user-not-found":
        return "No account found with that email.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <Logo size={64} />
        </div>
        <h1 className="login-logo">Floos<span>Track</span></h1>
        <p className="login-subtitle">{isSignup ? t("login.createAccount") : t("login.welcomeBack")}</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>{t("login.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mohamed"
                required
              />
            </>
          )}

          <label>{t("login.email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label>{t("login.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />

          <button type="submit" className="btn income-btn login-submit" disabled={loading}>
            {loading ? t("login.pleaseWait") : isSignup ? t("login.signup") : t("login.login")}
          </button>
        </form>

        <div className="login-divider">{t("login.or")}</div>

        <button className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
          {t("login.continueWithGoogle")}
        </button>

        <p className="login-toggle">
          {isSignup ? t("login.haveAccount") : t("login.noAccount")}{" "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? t("login.login") : t("login.signup")}
          </span>
        </p>
      </div>
    </div>
  );
}