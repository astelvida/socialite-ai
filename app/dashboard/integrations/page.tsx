import { IntegrationsContainer } from "@/app/dashboard/integrations/integrations-container";
import { IntegrationsView } from "@/app/dashboard/integrations/integrations-view";
import { getInstagramMedia, getInstagramUserProfile } from "@/lib/instagram";
import prisma from "@/lib/prisma";
import { saveInstagramMedia, saveInstagramProfile } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ACCESS_TOKEN =
  "IGAAJJCenxy8pBZAE80Mk9zVWlObHdaamJsQ3RIcGFvaU5zUWpHU3licXdBc2RfY05yd201ZA3BxUHR5RHRLQ0FaRHJtSGJWSU9kZA09oaWdtb29Rd2U5Q3hIRFFwSkNPVEVXSnpFRFNDWEtfWHRjN1lHNXhR";

// const getInstagramData = async (e: React.FormEvent<HTMLFormElement>) => {

export default async function IntegrationsPage(props: Props) {
  const searchParams = await props.searchParams;
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const integration = await prisma.integration.findFirst({
    where: {
      userId: userId,
      name: "INSTAGRAM"
    }
  });

  console.log("INSTAGRAM INTEGRATION", integration);

  const instagramData = searchParams["instagram_data"]?.toString() ?? "";
  const instagramError = searchParams["instagram_error"]?.toString() ?? "";

  // const instagramMedia = await getInstagramMedia(userId);
  return (
    <div>
      <h1>Integrations</h1>
      <form
        action={async () => {
          "use server";
          const instagramProfile = await getInstagramUserProfile(integration?.accessToken ?? "");
          const savedInstagramProfile = await saveInstagramProfile(instagramProfile, integration?.id ?? "");
          console.log("SAVED INSTAGRAM PROFILE", savedInstagramProfile);
          return instagramData;
        }}>
        <button type="submit">Get Instagram Data</button>
      </form>
      <form
        action={async () => {
          "use server";
          const instagramMedia = await getInstagramMedia(integration?.accessToken ?? "");
          console.log("INSTAGRAM MEDIA", instagramMedia);
          const savedInstagramMedia = await saveInstagramMedia(instagramMedia, integration?.id ?? "");
          console.log("SAVED INSTAGRAM MEDIA", savedInstagramMedia);
          return instagramData;
        }}>
        <button type="submit">Get Instagram Media</button>
      </form>

      <IntegrationsContainer userId={userId} instagramData={instagramData} instagramError={instagramError}>
        <IntegrationsView />
      </IntegrationsContainer>
    </div>
  );
}
