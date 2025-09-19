'use client';

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [orderId, setOrderId] = useState('');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      alert('Please enter an Order ID');
      return;
    }

    // Retrieve order from localStorage
    const storedOrder = localStorage.getItem(`order_${orderId}`);
    if (storedOrder) {
      setTrackingResult(JSON.parse(storedOrder));
    } else {
      alert('Order not found. Please check your Order ID.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            <span className="text-xl font-bold text-black">GharKaKhaana</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className="text-black hover:text-purple-600 transition-colors">Home</Link>
            <Link href="#track" className="text-black hover:text-purple-600 transition-colors">Track</Link>
            <Link href="#profile" className="text-black hover:text-purple-600 transition-colors">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-600 mb-4">
            Fast delivery in Chennai From Delhi
          </h1>
          <p className="text-xl text-black mb-8">
            Your homemade food delivered fast at your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Sign in with Mobile
            </button>
            <Link
              href="/map"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Order Food
            </Link>
          </div>
        </div>

        {/* Order Tracking Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-black mb-6 text-center">Track your order</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Enter Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                placeholder="Enter your order ID"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCity('Chennai')}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCity === 'Chennai'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                Chennai
              </button>
              <button
                onClick={() => setSelectedCity('Delhi')}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCity === 'Delhi'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                Delhi
              </button>
            </div>

            <button
              onClick={handleTrackOrder}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Quick Track
            </button>
          </div>

          {/* Tracking Results */}
          {trackingResult && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Order Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-black"><span className="font-medium">Order ID:</span> {trackingResult.trackingId}</p>
                <p className="text-black"><span className="font-medium">Pickup Point:</span> {trackingResult.pickupPoint}</p>
                <p className="text-black"><span className="font-medium">Transport:</span> {trackingResult.transport}</p>
                <p className="text-black"><span className="font-medium">Items:</span></p>
                <ul className="list-disc list-inside ml-4">
                  {trackingResult.items.filter((item: string) => item.trim()).map((item: string, index: number) => (
                    <li key={index} className="text-black">{item}</li>
                  ))}
                </ul>
                <p className="text-black"><span className="font-medium">Status:</span> <span className="text-green-600">Order Confirmed</span></p>
              </div>
            </div>
          )}
        </div>

                  <div className="text-center mt-8 text-sm text-black">
            Service is currently available only in Chennai and Delhi.
          </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                <span className="text-lg font-bold text-black">GharKaKhaana</span>
              </div>
              <p className="text-black text-sm">
                Fast deliveries across Chennai and Delhi. Track your orders in real-time and sign in via your mobile number.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3">Cities</h3>
              <ul className="space-y-1 text-sm text-black">
                <li>Chennai</li>
                <li>Delhi</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-3">Contact</h3>
              <div className="space-y-1 text-sm text-black">
                <p>Email: support@gharkakhaana.co</p>
                <p>Phone: +91 88888 88888</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center text-sm text-black">
            © 2025 GharKaKhaana. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
