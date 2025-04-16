"use client";

import { InstagramFeed } from "@/components/instagram/InstagramFeed";
import { MainContent } from "@/components/layout/main-content";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInstagramToken } from "@/hooks/useInstagramToken";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaInstagram } from "react-icons/fa";

interface InstagramProfile {
  id: string;
  username: string;
}

interface InstagramSession {
  profile: InstagramProfile;
  token: string;
  tokenExpires?: number;
  tokenCreatedAt?: number;
  media: any[];
}

export default function InstagramIntegrationPage() {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [tokenExpires, setTokenExpires] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated, isLoading, error } = useInstagramToken();

  useEffect(() => {
    // Check if we have an Instagram session
    const sessionData = localStorage.getItem("instagram_session");

    if (sessionData) {
      try {
        const session: InstagramSession = JSON.parse(sessionData);
        setProfile(session.profile);

        // Set token expiration date if available
        if (session.tokenExpires) {
          setTokenExpires(new Date(session.tokenExpires));
        }
      } catch (err) {
        console.error("Error parsing Instagram session:", err);
      }
    }

    setLoading(false);
  }, []);

  const handleDisconnect = () => {
    localStorage.removeItem("instagram_session");
    setProfile(null);
    setTokenExpires(null);
  };

  const formatExpiryDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return format(date, "PPP");
  };

  // Calculate days until token expiration
  const getDaysUntilExpiry = (expiryDate: Date | null) => {
    if (!expiryDate) return null;
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiry(tokenExpires);

  return (
    <div className="flex h-screen bg-[#1a1a1e] text-white">
      <Sidebar />
      <MainContent>
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link href="/integrations">
                <FaArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center">
              <FaInstagram className="h-6 w-6 mr-2 text-pink-500" />
              <h1 className="text-2xl font-bold">Instagram Integration</h1>
            </div>
          </div>

          {isLoading || loading ? (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardContent className="pt-6">
                <p>Loading Instagram data...</p>
              </CardContent>
            </Card>
          ) : !isAuthenticated || !profile ? (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle>Not Connected</CardTitle>
                <CardDescription className="text-gray-400">
                  You need to connect your Instagram Professional account to use this integration.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/integrations">Go to Integrations</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-md bg-pink-500/10">
                        <FaInstagram className="h-6 w-6 text-pink-500" />
                      </div>
                      <div>
                        <CardTitle>Connected as @{profile.username}</CardTitle>
                        <CardDescription className="text-gray-400">
                          Your Instagram content is now available for automation.
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-900/20 text-green-400">
                      Connected
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-400">
                    <p>User ID: {profile.id}</p>
                    {tokenExpires && (
                      <div className="mt-2">
                        <p>
                          Access Token Expires: {formatExpiryDate(tokenExpires)}
                          {daysUntilExpiry !== null && (
                            <span
                              className={`ml-2 ${
                                daysUntilExpiry < 10 ? "text-amber-500" : "text-green-500"
                              }`}
                            >
                              ({daysUntilExpiry} days remaining)
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs">
                          Using Instagram API v22.0 with long-lived tokens that automatically
                          refresh
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <a
                      href={`https://instagram.com/${profile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Profile
                    </a>
                  </Button>
                  <Button variant="destructive" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </CardFooter>
              </Card>

              <h2 className="text-xl font-bold mb-4">Your Instagram Media</h2>
              <InstagramFeed limit={9} loadFromApi={true} />
            </>
          )}
        </div>
      </MainContent>
    </div>
  );
}
