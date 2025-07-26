"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Or hamburger icon

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Optional: persist state
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed.toString());
  }, [collapsed]);

  return (
    <div
      className={`h-full bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Links */}
      <nav className="space-y-2 px-2">
        <Link href="/" className="block py-2 px-4 hover:bg-gray-700 rounded">
          🏠 {collapsed ? "" : "Home"}
        </Link>
        <Link href="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">
          📊 {collapsed ? "" : "Dashboard"}
        </Link>
        <Link href="/admin" className="block py-2 px-4 hover:bg-gray-700 rounded">
          👤 {collapsed ? "" : "Admin"}
        </Link>
      </nav>
    </div>
  );
}
