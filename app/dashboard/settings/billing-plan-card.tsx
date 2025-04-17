"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, CheckIcon } from "lucide-react";

interface PaymentCardProps {
  currentPlan: string | number;
  id: string | number;
  cta: string;
  name: string;
  features: string[];
  description: string;
  price: string | number;
}

export const BillingPlanCard = ({
  currentPlan,
  id,
  cta,
  name,
  features,
  description,
  price,
}: PaymentCardProps) => {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between gap-2 transition-all duration-200 hover:shadow-lg",
        currentPlan !== id && "hover:scale-105"
      )}
    >
      <CardHeader className="relative">
        {currentPlan === id && (
          <Badge className="bg-primary text-primary-foreground absolute top-0 right-6">
            Current Plan
          </Badge>
        )}
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1">/month</span>
          {/* {isAnnual && (
            <p className="text-muted-foreground mt-1 text-sm">
              Billed annually
            </p>
          )} */}
        </div>
        <div className="flex flex-col gap-2">
          <ul>
            {features.map((feature) => (
              <li key={feature} className="text-foreground flex gap-x-2 text-sm">
                <CheckIcon className="mr-2 h-4 w-4" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        {currentPlan === id ? (
          <Button className="w-full" variant="outline" disabled>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Current Plan
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={(e) => {
              console.log("clicked");
              // TODO: Implement payment
            }}
            className={cn(
              "mt-5 w-full rounded-full text-white",
              "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
            )}
          >
            {cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
