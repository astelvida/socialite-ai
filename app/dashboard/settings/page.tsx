import { fakeFetch } from "@/lib/helpers";
import { BillingPlans } from "./billing-plans";

export default async function SettingsPage() {
  // MOCK REQUEST
  const currentPlan = await fakeFetch("FREE");

  return <BillingPlans currentPlan={currentPlan as string} />;
}
