export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#1a1a1e] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The automation you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <a href="/dashboard" className="text-blue-400 hover:underline">
          Return to dashboard
        </a>
      </div>
    </div>
  );
}
