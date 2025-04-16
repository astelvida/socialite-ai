import { refreshLongLivedToken } from "@/lib/instagram";
import { useEffect, useState } from "react";

interface UseInstagramTokenResult {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useInstagramToken(): UseInstagramTokenResult {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAndRefreshToken() {
      try {
        setIsLoading(true);
        const sessionData = localStorage.getItem("instagram_session");

        if (!sessionData) {
          setIsLoading(false);
          return;
        }

        const session = JSON.parse(sessionData);

        // Check if we have a token
        if (!session.token) {
          setError("No Instagram token available");
          setIsLoading(false);
          return;
        }

        // Check if token is near expiration (less than 5 days remaining)
        const now = Date.now();
        const expiresAt = session.tokenExpires || 0;
        const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;

        // If token expires in less than 5 days and is at least 24 hours old, refresh it
        if (expiresAt - now < fiveDaysInMs && expiresAt > 0) {
          try {
            // Token must be at least 24 hours old to refresh
            const tokenTimestamp = session.tokenCreatedAt || expiresAt - 60 * 24 * 60 * 60 * 1000;
            const tokenAgeInMs = now - tokenTimestamp;
            const oneDayInMs = 24 * 60 * 60 * 1000;

            if (tokenAgeInMs >= oneDayInMs) {
              console.log("Refreshing Instagram token...");
              const refreshedToken = await refreshLongLivedToken(session.token);

              // Update the session with new token and expiration
              const updatedSession = {
                ...session,
                token: refreshedToken.access_token,
                tokenExpires: now + refreshedToken.expires_in * 1000,
                tokenCreatedAt: now,
              };

              localStorage.setItem("instagram_session", JSON.stringify(updatedSession));
              setToken(refreshedToken.access_token);
            } else {
              // Token not old enough to refresh yet
              setToken(session.token);
            }
          } catch (err) {
            console.error("Failed to refresh Instagram token:", err);
            // Still use the existing token even if refresh failed
            setToken(session.token);
          }
        } else {
          // Token is still valid and not close to expiration
          setToken(session.token);
        }
      } catch (err) {
        console.error("Error in Instagram token check:", err);
        setError("Failed to process Instagram token");
      } finally {
        setIsLoading(false);
      }
    }

    checkAndRefreshToken();
  }, []);

  return {
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
  };
}
