import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 overflow-y-auto">{children}</main>

          {/* Bottom Navigation for mobile */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>

      </body>
    </html>
  );
}
