import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pb-20">{children}</main> {/* 👈 padding-bottom added */}
        <BottomNavbar />
      </body>
    </html>
  );
}
