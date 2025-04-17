import { IntegrationsContainer } from "@/app/dashboard/integrations/integrations-container";
import { IntegrationsView } from "@/app/dashboard/integrations/integrations-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function IntegrationsPage(props: Props) {
  const searchParams = await props.searchParams;
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const instagramData = searchParams["instagram_data"]?.toString() ?? "";
  const instagramError = searchParams["instagram_error"]?.toString() ?? "";

  return (
    <IntegrationsContainer userId={userId} instagramData={instagramData} instagramError={instagramError}>
      <IntegrationsView />
    </IntegrationsContainer>
  );
}
