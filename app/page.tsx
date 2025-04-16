import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Instagram API Integration Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Instagram Authentication</CardTitle>
            <CardDescription>
              Connect with your Instagram Business account to access your profile and media.
            </CardDescription>
          </CardHeader>
          <div className="p-6">
            <Button asChild>
              <Link href="/instagram">Go to Instagram Page</Link>
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              Learn more about the Instagram API and how to use it in your applications.
            </CardDescription>
          </CardHeader>
          <div className="p-6">
            <Button variant="outline" asChild>
              <a
                href="https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Documentation
              </a>
            </Button>
          </div>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">How to Use</h2>
        <ol className="list-decimal ml-5 space-y-2">
          <li>Go to the Instagram page using the button above</li>
          <li>Log in with your Instagram Business account</li>
          <li>After authentication, you'll see your Instagram profile and media</li>
          <li>Your session will be stored locally for future use</li>
        </ol>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Requirements</h2>
        <ul className="list-disc ml-5 space-y-2">
          <li>An Instagram Professional account (Business or Creator)</li>
          <li>An Instagram App registered in the Meta Developer Portal</li>
          <li>Properly configured redirect URIs in your Instagram App settings</li>
        </ul>
      </div>
    </div>
  );
}
