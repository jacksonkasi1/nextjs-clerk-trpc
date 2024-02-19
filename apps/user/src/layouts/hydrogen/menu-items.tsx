import { routes } from "@/config/routes";
import { PiShoppingCartDuotone, PiFolderNotchDuotone, PiKeyDuotone, PiUserDuotone } from "react-icons/pi";

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  // label start
  {
    name: "Overview",
  },
  // label end
  {
    name: "Dashboard",
    href: routes.dashboard,
    icon: <PiFolderNotchDuotone />,
  },
  {
    name: "Profile",
    href: routes.profile,
    icon: <PiUserDuotone />,
  },
  // label start
  {
    name: "Billing & Plan",
  },
  // label end
  {
    name: "Plan",
    href: "#",
    icon: <PiShoppingCartDuotone />,
    dropdownItems: [
      {
        name: "Subscription",
        href: routes.plan.subscription,
        badge: "",
      },
      {
        name: "Billing History",
        href: routes.plan.billingHistory,
      },
    ],
  },
];
