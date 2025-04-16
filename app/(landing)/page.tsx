import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Code, Globe, Layers, Workflow } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Automate Your Social Media Workflow
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Connect your Instagram account and unlock powerful automation tools to streamline
                  your content management.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </SignedIn>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl shadow-xl">
                <Image
                  src="/dashboard-preview.svg"
                  alt="Dashboard Preview"
                  width={600}
                  height={400}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Key Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to supercharge your Instagram presence.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Workflow className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Automation Workflows</CardTitle>
                <CardDescription>
                  Create custom workflows to automate your Instagram content pipeline.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instagram Integration</CardTitle>
                <CardDescription>
                  Seamlessly connect with the Instagram API for complete profile control.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Schedule, publish, and analyze your Instagram content from one place.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to get started?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of creators who are saving time and boosting engagement with our
                  platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg">
                      Create Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </SignedIn>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 p-8">
                <div className="flex flex-col items-start justify-center h-full space-y-4">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Developer-Friendly</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our platform provides robust APIs and integrations for developers who want to
                    build custom solutions.
                  </p>
                  <Button variant="outline" asChild className="mt-4">
                    <a href="#" className="flex items-center justify-center">
                      View Documentation
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t mt-auto">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Social Automation. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                Terms
              </Link>
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                Privacy
              </Link>
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
