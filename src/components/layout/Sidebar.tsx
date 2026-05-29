import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Table,
  Shield,
  Folder,
  FileText,
  Settings,
} from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { label: "Project Overview", href: "/dashboard", icon: Home },
  { label: "Tasks", href: "/tasks", icon: Table },
  { label: "Users", href: "/users", icon: Shield },
  { label: "Projects", href: "/projects", icon: Folder },
  { label: "Reports", href: "/reports", icon: FileText },
];

const Sidebar = () => {
  return (
    <aside className=" flex h-full w-64 flex-col border-r border-border bg-red-50 " >
      <div className="flex h-14 items-center border-b px-4">
        <div className="h-8 w-8 rounded bg-emerald-500" />
        <span className="ml-3 font-semibold">
          Task Planner
        </span>
      </div>

      <nav className="flex-1 p-2">
        {menuItems.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className=" mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted "
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;