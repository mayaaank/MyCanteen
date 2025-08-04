"use client";

import { QRCode } from "react-qrcode-logo";
import { useEffect, useState } from "react";

export default function QRPage() {
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    // Dummy user data – replace with actual user info from context/auth
    const user = {
      id: "stu1023",
      name: "Kanak",
      meal: "lunch",
      date: new Date().toISOString().split("T")[0],
    };

    setQrData(JSON.stringify(user));
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50 px-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Your Attendance QR</h1>
      <p className="text-gray-700 mb-6 text-center">
        Show this QR to the admin for marking your attendance.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {qrData && (
          <QRCode
            value={qrData}
            size={220}
            bgColor="#ffffff"
            fgColor="#2563eb" // Tailwind blue-600 as hex
            qrStyle="dots"
            eyeRadius={5}
          />
        )}
      </div>
    </div>
  );
}
