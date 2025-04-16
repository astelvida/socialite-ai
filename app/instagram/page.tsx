"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInstagramAuthUrl } from "@/lib/instagram";
import Image from "next/image";
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

interface InstagramProfile {
  id: string;
  username: string;
}

export default function InstagramPage() {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're returning from Instagram authentication
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      setLoading(true);
      // Exchange the code for an access token and fetch profile
      fetch(`/api/instagram/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setProfile(data.profile);
            setMedia(data.media || []);

            // Store in localStorage for other components to use
            localStorage.setItem(
              "instagram_session",
              JSON.stringify({
                profile: data.profile,
                media: data.media,
              })
            );

            // Remove the code from URL to prevent re-fetching on refresh
            window.history.replaceState({}, document.title, "/instagram");
          }
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Check if we already have a session
      const sessionData = localStorage.getItem("instagram_session");
      if (sessionData) {
        try {
          const { profile, media } = JSON.parse(sessionData);
          setProfile(profile);
          setMedia(media || []);
        } catch (err) {
          // Invalid session data, clear it
          localStorage.removeItem("instagram_session");
        }
      }
    }
  }, []);

  const handleLogin = () => {
    // Redirect to Instagram authorization URL
    window.location.href = "/api/instagram/auth";
  };

  const handleLogout = () => {
    localStorage.removeItem("instagram_session");
    setProfile(null);
    setMedia([]);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Instagram Integration</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!profile ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect with Instagram</CardTitle>
            <CardDescription>
              Log in with your Instagram business account to access your profile and media.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This integration uses the Instagram API with Instagram Login to access your business
              account data.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? "Loading..." : "Login with Instagram"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Instagram Profile</CardTitle>
              <CardDescription>Connected as @{profile.username}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User ID: {profile.id}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleLogout}>
                Disconnect
              </Button>
            </CardFooter>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Your Media</h2>

          {media.length === 0 ? (
            <p>No media found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM" ? (
                      <div className="relative aspect-square overflow-hidden rounded-md mb-2">
                        <img
                          src={item.media_url}
                          alt={item.caption || "Instagram media"}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : item.media_type === "VIDEO" ? (
                      <div className="relative aspect-video overflow-hidden rounded-md mb-2">
                        <img
                          src={item.thumbnail_url || item.media_url}
                          alt={item.caption || "Instagram video thumbnail"}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : null}

                    <p className="text-sm text-gray-500 truncate">{item.caption || "No caption"}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.permalink} target="_blank" rel="noopener noreferrer">
                        View on Instagram
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
