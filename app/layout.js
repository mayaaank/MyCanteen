// app/layout.js
import "@/app/globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "MyCanteen",
  description: "Digital Canteen Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
