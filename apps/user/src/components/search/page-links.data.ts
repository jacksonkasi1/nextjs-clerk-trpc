import { routes } from "@/config/routes";
import { DUMMY_ID } from "@/config/constants";

// Note: do not add href in the label object, it is rendering as label
export const pageLinks = [
  {
    name: "Dashboard",
    href: routes.dashboard,
  },
  {
    name: "Profile",
    href: routes.profile,
  },
  // label start
  {
    name: "Billing & Plan",
  },
  // label start
  {
    name: "Subscription",
    href: routes.plan.subscription,
  },
  {
    name: "Billing History",
    href: routes.plan.billingHistory,
  },
];
