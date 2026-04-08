import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Boxes,
  Package,
  Layers,
  ClipboardList,
  FileDown,
  Cog,
  Clock,
  Users2,
  Star,
  Settings2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const NAVIGATION_CONFIG = {
  COMMON: {
    DASHBOARD: {
      title: "Dashboard",
      url: "/home",
      icon: LayoutDashboard,
    },
    PROFILE: {
      title: "Profile",
      url: "/profile",
      icon: Cog,
    },
    FAMILY_MEMBER: {
      title: "Family Member",
      url: "/family-member",
      icon: Layers,
    },
    LIFE_TIME_MEMBER: {
      title: "Life Time Members",
      url: "/life-time-member",
      icon: Package,
    },
    PATRON_MEMBER: {
      title: "Patron Members",
      url: "/patron-member",
      icon: Boxes,
    },
    NEW_REGISTER: {
      title: "New Register",
      url: "/new-register",
      icon: ClipboardList,
    },
    PENDING_MID: {
      title: "Pending MID",
      url: "/pending-mid",
      icon: Clock,
    },
    DEVELOPER: {
      title: "Developer",
      url: "/developer",
      icon: LayoutDashboard,
    },
    EVENT: {
      title: "Events",
      url: "#",
      icon: Users2,
      items: [
        {
          title: "Samaj",
          url: "/samaj",
        },
        {
          title: "Mahila",
          url: "/mahila",
        },
        {
          title: "Developer",
          url: "/developer",
        },
      ],
    },
    DOWNLOAD: {
      title: "Download",
      url: "/download",
      icon: FileDown,
    },
  },
};

const USER_ROLE_PERMISSIONS = {
  1: {
    navMain: ["DASHBOARD", "PROFILE", "FAMILY_MEMBER"],
  },
  2: {
    navMain: [
      "DASHBOARD",
      "PROFILE",
      "FAMILY_MEMBER",
      "LIFE_TIME_MEMBER",
      "PATRON_MEMBER",
      "NEW_REGISTER",
      "EVENT",
      "DOWNLOAD",
    ],
  },
  3: {
    navMain: [
      "DASHBOARD",
      "PROFILE",
      "FAMILY_MEMBER",
      "LIFE_TIME_MEMBER",
      "PATRON_MEMBER",
      "NEW_REGISTER",
      "EVENT",
      "DOWNLOAD",
    ],
  },
};

const LIMITED_MASTER_SETTINGS = {
  title: "Master Settings",
  url: "#",
  isActive: false,
  icon: Settings2,
  items: [
    {
      title: "Chapters",
      url: "/master/chapter",
    },
  ],
};

const useNavigationData = (userTypeId) => {
  return useMemo(() => {
    const permissions =
      USER_ROLE_PERMISSIONS[userTypeId] || USER_ROLE_PERMISSIONS[1];

    const buildNavItems = (permissionKeys, config, customItems = {}) => {
      return permissionKeys
        .map((key) => {
          if (key === "MASTER_SETTINGS_LIMITED") {
            return LIMITED_MASTER_SETTINGS;
          }
          return config[key];
        })
        .filter(Boolean);
    };

    const navMain = buildNavItems(
      permissions.navMain,
      // { ...NAVIGATION_CONFIG.COMMON, ...NAVIGATION_CONFIG.MODULES },
      { ...NAVIGATION_CONFIG.COMMON },
      // { MASTER_SETTINGS_LIMITED: LIMITED_MASTER_SETTINGS }
    );

    // const navMainReport = buildNavItems(
    //   permissions.navMainReport,
    //   NAVIGATION_CONFIG.REPORTS
    // );

    return { navMain };
  }, [userTypeId]);
};

const Logo = ({ className }) => (
  <img src="https://new.agrawalsamaj.co/assets/logo-LrjSJo0H.png" alt="Logo" className={className} />
);

const TEAMS_CONFIG = [
  {
    name: "Agarwal Samaj",
    logo: Logo,
    plan: "CRM Panel",
  },
];

export function AppSidebar({ ...props }) {
  const [openItem, setOpenItem] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const user_type_id = useSelector((state) => state.auth.user_type_id);
  const { navMain, navMainReport } = useNavigationData(user_type_id);
  const initialData = {
    user: {
      name: user?.name || "User",
      email: user?.email || "user@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: TEAMS_CONFIG,
    navMain,
    navMainReport,
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={initialData.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <NavMain
          items={initialData.navMain}
          openItem={openItem}
          setOpenItem={setOpenItem}
        />
        {/* <NavMainReport
          items={initialData.navMainReport}
          openItem={openItem}
          setOpenItem={setOpenItem}
        /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={initialData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { NAVIGATION_CONFIG, USER_ROLE_PERMISSIONS };

