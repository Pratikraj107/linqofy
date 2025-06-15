import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, User, LogOut, Mail, Menu, X, Layers } from "lucide-react";
import { useState } from "react";

interface SideNavProps {
  activeTab: string;
  onLogout: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navItems = [
  { label: "Discover Projects", href: "/discover", icon: <Home className="h-5 w-5" /> },
  { label: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
  { label: "Proposals", href: "/proposals", icon: <Mail className="h-5 w-5" /> },
  { label: "Messages", href: "/messages", icon: <Mail className="h-5 w-5" /> },
  { label: "Create Project", href: "/projects/create", icon: <Layers className="h-5 w-5" /> },
];

export function SideNav({ activeTab, onLogout, open, setOpen }: SideNavProps) {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/');
  };

  if (!open) {
    return (
      <button
        className="fixed top-6 left-4 z-50 bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>
    );
  }

  return (
    <nav className="fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 py-8 px-4 flex flex-col gap-2 shadow-sm z-50 transition-transform duration-300">
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-50 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(false)}
        aria-label="Close sidebar"
        style={{ zIndex: 100 }}
      >
        <X className="h-6 w-6 text-gray-700" />
      </button>
      {/* Logo section */}
      <div className="flex items-center gap-3 mb-8 px-2 mt-0">
      
        <span className="font-playfair text-2xl font-bold " >Linqofy</span>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-[#000b76]/10 hover:text-[#000b76] transition-colors ${
              activeTab === item.href ? "bg-[#000b76]/10 text-[#000b76]" : ""
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </nav>
  );
} 