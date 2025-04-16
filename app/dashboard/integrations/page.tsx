import { IntegrationsView } from "@/components/integrations/integrations-view";
import { IntegrationsViewContainer } from "@/components/integrations/integrtaion-view-container";
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

  const instagramData = searchParams["instagram_data"];
  const instagramError = searchParams["instagram_error"];

  return (
    <IntegrationsViewContainer
      userId={userId}
      instagramData={instagramData}
      instagramError={instagramError}
    >
      <IntegrationsView />
    </IntegrationsViewContainer>
  );
}
