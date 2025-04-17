import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function NotFound() {
  const { userId } = await auth();

  return (
    <div className="flex h-screen items-center justify-center bg-[#1a1a1e] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">Page not found. Please check the URL and try again. Oops!!!</p>
        <Link href={userId ? "/dashboard" : "/"} className="text-blue-400 hover:underline">
          {userId ? "Return to dashboard" : "Return to landing page"}
        </Link>
      </div>
    </div>
  );
}
