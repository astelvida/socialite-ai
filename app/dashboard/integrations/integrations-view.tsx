"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
// Import icons from react-icons
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { FaTableCells } from "react-icons/fa6";
import { SiGooglesheets } from "react-icons/si";
// Define integration type
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  color: string;
  bgColor: string;
  connected: boolean;
  detailsPath?: string;
}

// Integration data
const integrations: Integration[] = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram account to automate posts and engage with your audience.",
    icon: FaInstagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    connected: false,
    detailsPath: "/dashboard/integrations/instagram",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Integrate with WhatsApp to automate messages and customer support.",
    icon: FaWhatsapp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    connected: false,
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Connect to Google Sheets to automatically import and export data.",
    icon: SiGooglesheets,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    connected: false,
  },
];

// Previously available integrations
const availableIntegrations: Integration[] = [
  {
    id: "twitter",
    name: "Twitter",
    description: "Connect your Twitter account to schedule and automate tweets.",
    icon: FaTwitter,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    connected: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect your Facebook account to schedule posts and respond to messages.",
    icon: FaFacebookF,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    connected: false,
  },
];

export function IntegrationsView() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [integrationsState, setIntegrationsState] = useState<Integration[]>([
    ...integrations,
    ...availableIntegrations,
  ]);

  // Check if we have any connected integrations in localStorage
  useEffect(() => {
    const checkInstagramConnection = async () => {
      // Check for Instagram connection

      // const instagramSessionFromRedis = await getUserSession(userId);
      const instagramSession = localStorage.getItem("instagram_session");

      let instagramSessionData: any;
      if (instagramSession) {
        try {
          instagramSessionData = JSON.parse(instagramSession);
          if (
            instagramSessionData &&
            instagramSessionData.profile &&
            instagramSessionData.profile.id
          ) {
            // Update the connected status for Instagram
            setIntegrationsState((prevState) =>
              prevState.map((integration) =>
                integration.id === "instagram" ? { ...integration, connected: true } : integration
              )
            );
          }

          console.log("instagramSessionData", instagramSessionData);
        } catch (err) {
          console.error("Error parsing Instagram session:", err);
        }
      }
    };

    checkInstagramConnection();
  }, []); // Empty dependency array to run only once

  const filteredIntegrations = integrationsState.filter((integration) =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = (id: string) => {
    // Handle specific integrations
    switch (id) {
      case "instagram":
        // Redirect to Instagram auth flow
        window.location.href = "/api/instagram/auth";
        break;
      // Add other integrations as needed
      default:
        console.log(`Connecting to ${id}...`);
        break;
    }
  };

  const handleDisconnect = (id: string) => {
    // Handle specific disconnections
    switch (id) {
      case "instagram":
        // Remove Instagram session
        localStorage.removeItem("instagram_session");
        // Update state to show disconnected
        setIntegrationsState((prevState) =>
          prevState.map((integration) =>
            integration.id === "instagram" ? { ...integration, connected: false } : integration
          )
        );
        break;
      default:
        console.log(`Disconnecting from ${id}...`);
        break;
    }
  };

  const handleCardClick = (integration: Integration) => {
    if (integration.connected && integration.detailsPath) {
      router.push(integration.detailsPath);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6 md:mb-8">
        <FaTableCells className="h-6 w-6 mr-2 text-blue-400" />
        <h1 className="text-2xl font-bold">Integrations</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div className="w-full md:flex-1">
          <Input
            type="text"
            placeholder="Search integrations"
            className="w-full md:max-w-md bg-gray-800 border-gray-700 text-white"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <Card
            key={integration.id}
            className={`bg-gray-800 border-gray-700 ${
              integration.connected && integration.detailsPath
                ? "cursor-pointer hover:bg-gray-700 transition-colors"
                : ""
            }`}
            onClick={() => handleCardClick(integration)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-md ${integration.bgColor}`}>
                  <integration.icon className={`h-6 w-6 ${integration.color}`} />
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    integration.connected
                      ? "bg-green-900/20 text-green-400"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {integration.connected ? "Connected" : "Not Connected"}
                </div>
              </div>
              <CardTitle className="mt-4">{integration.name}</CardTitle>
              <CardDescription className="text-gray-400">{integration.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                variant={integration.connected ? "destructive" : "default"}
                className={
                  integration.connected
                    ? "bg-red-600 hover:bg-red-700 w-full"
                    : "bg-blue-600 hover:bg-blue-700 w-full"
                }
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  integration.connected
                    ? handleDisconnect(integration.id)
                    : handleConnect(integration.id);
                }}
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </Button>

              {integration.connected && integration.detailsPath && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={integration.detailsPath} onClick={(e) => e.stopPropagation()}>
                    View Details
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
