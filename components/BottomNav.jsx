"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard", label: "🏠" },
    { href: "/attendance", label: "📋" },
    { href: "/menu", label: "🍽️" },
  ];

  return (
    <nav className="fixed bottom-0 w-full md:hidden bg-gray-800 text-white flex justify-around py-2 border-t border-gray-700">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`text-2xl px-4 ${
            pathname === tab.href ? "text-yellow-400" : "text-white"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
