'use client'

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  return (

    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo only, no text */}
        <div
          className="cursor-pointer select-none"
          onClick={() => handleNavigate('/')}
        >
          <img
  src="/logo.svg"
  alt="mycanteen logo"
  className="w-14 h-14 object-contain" // 56px x 56px, can further adjust as needed
  draggable={false}
/>

        </div>

        {/* Hamburger button for mobile */}
        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8 font-medium text-blue-700">
          <button
            onClick={() => router.push('/login')}
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Signup
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <div className="flex flex-col p-4 space-y-4 font-semibold text-blue-700">
            <button
              onClick={() => handleNavigate('/')}
              className="text-left py-2 hover:bg-blue-100 rounded"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigate('/about')}
              className="text-left py-2 hover:bg-blue-100 rounded"
            >
              About
            </button>
            <button
              onClick={() => handleNavigate('/login')}
              className="text-left py-2 hover:bg-blue-100 rounded"
            >
              Login
            </button>
            <button
              onClick={() => handleNavigate('/signup')}
              className="text-left py-2 hover:bg-blue-100 rounded"
            >
              Signup
            </button>
          </div>
        </nav>
      )}
    </header>

  );
}
