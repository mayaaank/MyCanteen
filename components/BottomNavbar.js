import { Home, ShoppingBag, QrCode, BarChart3, User } from "lucide-react";
import Link from "next/link";

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t shadow-sm z-50 md:hidden">
      <div className="flex justify-around py-2">
        <Link href="/user/dashboard">
          <div className="flex flex-col items-center text-xs">
            <Home size={20} />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/qr">
          <div className="flex flex-col items-center text-xs">
            <QrCode size={20} />
            <span>QR</span>
          </div>
        </Link>
        <Link href="/poll">
          <div className="flex flex-col items-center text-xs">
            <BarChart3 size={20} />
            <span>Poll</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className="flex flex-col items-center text-xs">
            <User size={20} />
            <span>Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
