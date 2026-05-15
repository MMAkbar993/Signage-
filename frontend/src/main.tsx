import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const root = createRoot(document.getElementById("root")!);
root.render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  ) : (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
);
  