import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import type { LucideIcon } from "lucide-react";
import { Home, Table, Settings, LayoutDashboard, Users, ListIndentDecrease, ListIndentIncrease } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { label: "Project Overview", href: "/dashboard", icon: Home },
  { label: "Boards", href: "/boards", icon: Table },
  { label: "Team Boards", href: "/teamboard", icon: LayoutDashboard },
  { label: "Team Member", href: "/team-member", icon: Users },
];

const Sidebar = () => {
  const storageCollapsed = typeof window !== "undefined" ? localStorage.getItem("sidebar_collapsed") === "true" : false;
  const [ collapsed, setCollapsed ] = useState(storageCollapsed);
  const { pathname } = useRouter();

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar_collapsed", newState.toString());
  }

  return (
    <aside
      style={{ width: collapsed ? "52px" : "160px" }}
      className="flex h-full shrink-0 flex-col overflow-hidden border-r bg-gray-100 text-xs transition-[width] duration-300 ease-in-out"
    >
      <nav className="flex-1 p-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-md p-2 transition-colors
                ${isActive
                  ? "bg-black/80 text-white"
                  : "hover:bg-gray-200 text-gray-700"
                }`}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <Link
          href="/settings"
          className={`mb-2 flex items-center gap-3 rounded-md p-2 transition-colors ${pathname.startsWith("/settings") ? "bg-black/80 text-white" : "hover:bg-gray-200 text-gray-700" }`}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={toggleCollapsed}
          className="flex w-fit items-center gap-3 text-gray-700 rounded-md p-2 transition-colors hover:bg-gray-200"
        >
          {collapsed ? <ListIndentIncrease size={18} /> : <ListIndentDecrease size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;