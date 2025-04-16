"use client";

import { InstagramData } from "@/lib/instagram";
import { useEffect } from "react";
// Import icons from react-icons
import { toast } from "sonner";

export function IntegrationsViewContainer({
  instagramData,
  instagramError,
  children,
}: {
  instagramData: string;
  instagramError: string;
  children: React.ReactNode;
}) {
  // Handle Instagram data from redirect
  useEffect(() => {
    // const instagramData = searchParams.get("instagram_data");
    // const instagramError = searchParams.get("instagram_error");

    if (instagramData) {
      try {
        const data: InstagramData = JSON.parse(instagramData);

        // Store only necessary data in localStorage
        const sessionData = {
          profile: data.profile,
          media: data.media,
          // Store the long-lived token instead of the short-lived one
          token: data.longLivedToken,
          // Store the expiration date (60 days from now)
          tokenExpires: Date.now() + Number(data.expires_in) * 1000, // 60 days in milliseconds
        };

        localStorage.setItem("instagram_session", JSON.stringify(sessionData));

        // Remove data from URL without refreshing
        window.history.replaceState({}, document.title, "/dashboard/integrations");

        // Show success toast
        toast.success(`Successfully connected to Instagram as @${data.profile.username}`);
      } catch (err) {
        console.error("Error parsing Instagram data:", err);
        toast.error("Failed to process Instagram data");
      }
    } else if (instagramError) {
      // Show error toast
      toast.error(`Instagram error: ${instagramError}`);

      // Remove error from URL without refreshing
      window.history.replaceState({}, document.title, "/dashboard/integrations");
    }
  }, [instagramData, instagramError]);

  return children;
}
