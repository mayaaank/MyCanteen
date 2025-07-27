export default function QRPage() {
  return (
    <div className="pt-20 pb-24 px-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Scan Your QR</h1>
      <p className="text-gray-700 mb-6">Show this QR at the counter to confirm your order or check-in.</p>
      
      <div className="flex justify-center">
        <div className="w-48 h-48 border border-gray-400 flex items-center justify-center rounded-lg bg-gray-100">
          <p className="text-gray-500">[QR Code Placeholder]</p>
        </div>
      </div>
    </div>
  );
}
