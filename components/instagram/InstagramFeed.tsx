"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstagramToken } from "@/hooks/use-instagram-token";
import { getInstagramMedia } from "@/lib/instagram";
import { useEffect, useState } from "react";

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  username: string;
}

interface InstagramFeedProps {
  limit?: number;
  username?: string;
  loadFromApi?: boolean;
}

export function InstagramFeed({ limit = 6, username, loadFromApi = false }: InstagramFeedProps) {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated, isLoading: tokenLoading } = useInstagramToken();

  useEffect(() => {
    async function fetchMediaFromApi() {
      try {
        setLoading(true);
        // Get session to extract user_id
        const sessionData = localStorage.getItem("instagram_session");
        if (!sessionData || !token) {
          setError("Not authenticated with Instagram");
          setLoading(false);
          return;
        }

        const session = JSON.parse(sessionData);
        if (!session.profile || !session.profile.id) {
          setError("Invalid Instagram session data");
          setLoading(false);
          return;
        }

        // Fetch media directly from the Instagram API using the token
        const mediaItems = await getInstagramMedia(token);

        // Filter by username if provided
        const filteredMedia = username
          ? mediaItems.filter((item) => item.username === username)
          : mediaItems;

        // Apply limit and set media
        setMedia(filteredMedia.slice(0, limit));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Instagram media:", err);
        setError("Failed to fetch Instagram media");
        setLoading(false);
      }
    }

    async function loadMediaFromLocalStorage() {
      try {
        setLoading(true);
        // This would typically come from a context or state management
        // For demo purposes, we're using localStorage
        const sessionData = localStorage.getItem("instagram_session");

        if (!sessionData) {
          setError("Not connected to Instagram");
          setLoading(false);
          return;
        }

        try {
          const { profile, media } = JSON.parse(sessionData) as {
            profile: Record<string, any>;
            media: InstagramMedia[];
          };

          if (!profile || !media) {
            setError("No Instagram data available");
          } else {
            // Filter by username if provided
            const filteredMedia = username
              ? media.filter((item: InstagramMedia) => item.username === username)
              : media;

            // Apply limit and set media
            setMedia(filteredMedia.slice(0, limit));
          }
        } catch (err) {
          setError("Failed to load Instagram data");
        } finally {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading Instagram media:", err);
        setError("Failed to load Instagram media");
        setLoading(false);
      }
    }

    // Don't do anything until we know if we have a valid token
    if (tokenLoading) {
      return;
    }

    // Either load from API or from localStorage
    if (loadFromApi && isAuthenticated) {
      fetchMediaFromApi();
    } else {
      loadMediaFromLocalStorage();
    }
  }, [limit, username, loadFromApi, token, isAuthenticated, tokenLoading]);

  if (loading || tokenLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(limit)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="w-full aspect-square rounded-md" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button asChild>
          <a href="/dashboard/integrations">Connect Instagram</a>
        </Button>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No Instagram posts found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {media.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            {item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM" ? (
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.media_url}
                  alt={item.caption || "Instagram media"}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
            ) : item.media_type === "VIDEO" ? (
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.thumbnail_url || item.media_url}
                  alt={item.caption || "Instagram video thumbnail"}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="p-3">
            <a
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 truncate w-full"
            >
              {item.caption || "View on Instagram"}
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
