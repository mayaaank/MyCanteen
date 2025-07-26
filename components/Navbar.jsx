// components/Navbar.jsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-100 flex gap-6">
      <Link href="/">Home</Link>
      <Link href="/menu">Menu</Link>
      <Link href="/attendance">Attendance</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/login">Login</Link>
    </nav>
  );
}
