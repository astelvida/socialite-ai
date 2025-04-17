import { ActivityIcon, HomeIcon, RocketIcon, SettingsIcon } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "home",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "automations",
    href: "/dashboard/automations",
    icon: ActivityIcon,
  },
  {
    label: "integrations",
    href: "/dashboard/integrations",
    icon: RocketIcon,
  },
  {
    label: "settings",
    href: "/dashboard/settings",
    icon: SettingsIcon,
  },
];

export const PAGES = {
  HOME: "/",
  AUTOMATIONS: "/automations",
  INTEGRATIONS: "/integrations",
  SETTINGS: "/settings",
  BILLING: "/billing",
};

export type BillingPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
};

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: "FREE",
    name: "Starter Plan",
    description: "Perfect for getting started",
    price: "$0",
    features: [
      "Boost engagement with target responses",
      "Automate comment replies to enhance audience interaction",
      "Turn followers into customers with targeted messaging",
    ],
    cta: "Get Started",
  },
  {
    id: "PRO-1",
    name: "Smarty AI Dev",
    description: "Ideal for growing teams and businesses",
    price: "$29",
    features: [
      "All features from Starter Plan",
      "1000 credits for AI-powered response generation",
      "Priority customer support",
    ],
    cta: "Try Smarty AI Dev",
  },
  {
    id: "PRO-2",
    name: "Smarty AI Pro",
    description: "Advanced features for power users",
    price: "$99",
    features: [
      "All features from Smarty AI Dev",
      "AI-powered response generation",
      "Advanced analytics and insights",
      "Priority customer support",
      "Custom branding options",
    ],
    cta: "Upgrade to Smarty AI Pro",
  },
];
