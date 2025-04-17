"use client";

import { BILLING_PLANS } from "@/lib/constants";
import { BillingPlanCard } from "./billing-plan-card";

interface BillingProps {
  currentPlan?: string;
}

export function BillingPlans({ currentPlan = "FREE" }: BillingProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">Select the plan that best suits your needs.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BILLING_PLANS.map((plan) => (
          <BillingPlanCard key={plan.id} currentPlan={currentPlan} {...plan} />
        ))}
      </div>
    </div>
  );
}
