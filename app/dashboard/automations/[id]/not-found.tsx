import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#1a1a1e] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The automation you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/dashboard/automations" className="text-blue-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
// {
//   /* <div className="flex h-full items-center justify-center">
// <div className="text-center">
//   <h1 className="text-4xl font-bold mb-4">404 - Automation Not Found</h1>
//   <p className="text-gray-400 mb-8">The automation you're looking for doesn't exist or has been removed.</p>
//   <button onClick={() => router.push("/dashboard/automations")} className="text-blue-400 hover:underline">
//     Return to Automations
//   </button>
// </div>
// </div> */
// }
