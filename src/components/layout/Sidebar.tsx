import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, Home, Table, Settings } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { label: "Project Overview", href: "/dashboard", icon: Home },
  { label: "Boards", href: "/boards", icon: Table },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{ width: collapsed ? "52px" : "176px" }}
      className="flex h-full shrink-0 flex-col border-r bg-gray-100 text-xs transition-[width] duration-300 ease-in-out"
    >
      <nav className="flex-1 p-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mb-1 flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-200"
          >
            <item.icon size={18} className="shrink-0" />

            {!collapsed && (
              <span className="truncate">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t p-2">
        <Link
          href="/settings"
          className="mb-2 flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-slate-200"
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-fit items-center gap-3 rounded-md p-2 transition-colors hover:bg-slate-200"
        >
          {collapsed ? (<ChevronRight size={18} />) : (<ChevronLeft size={18} />)}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;