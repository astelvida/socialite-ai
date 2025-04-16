"use client";

import { IntegrationsView } from "@/components/integrations/integrations-view";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function IntegrationsPage() {
  const searchParams = useSearchParams();

  // Handle Instagram data from redirect
  useEffect(() => {
    const instagramData = searchParams.get("instagram_data");
    const instagramError = searchParams.get("instagram_error");

    if (instagramData) {
      try {
        const data = JSON.parse(instagramData);

        // Store only necessary data in localStorage
        const sessionData = {
          profile: data.profile,
          media: data.media,
          // Store the long-lived token instead of the short-lived one
          token: data.longLivedToken,
          // Store the expiration date (60 days from now)
          tokenExpires: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days in milliseconds
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
  }, [searchParams]);

  return <IntegrationsView />;
}
