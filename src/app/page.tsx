'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [orderId, setOrderId] = useState('');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [trackingResult, setTrackingResult] = useState<{
    trackingId: string;
    pickupPoint: string;
    transport: string;
    transportDetails: string;
    items: string[];
    transportMode: string;
    createdAt: string;
    status: string;
  } | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

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

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const openContactModal = () => {
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showProfileDropdown && !target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            <span className="text-xl font-bold text-black">GharKaKhaana</span>
          </div>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="text-black hover:text-purple-600 transition-colors">Home</Link>
            <Link href="#track" className="text-black hover:text-purple-600 transition-colors">Track</Link>

                        {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={toggleProfileDropdown}
                className="text-black hover:text-purple-600 transition-colors"
              >
                Profile
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <a href="#account" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                      Account
                    </a>
                    <a href="#orders" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                      Orders
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Us Button */}
            <button
              onClick={openContactModal}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Contact Us
            </button>
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
              <p className="text-gray-600 text-sm">
                Fast deliveries across Chennai and Delhi. Track your orders in real-time and sign in via your mobile number.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Cities</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Chennai</li>
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

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">About GharKaKhaana</h2>
              <button onClick={closeContactModal} className="text-black hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <p className="text-black leading-relaxed">
                GharKaKhaana is a licensed and trusted food delivery platform dedicated to bringing homemade meals from your loved ones straight to you.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-3">✅ We hold all necessary authorizations, including:</h3>
                <ul className="space-y-1 text-black ml-4">
                  <li>• Business License</li>
                  <li>• FSSAI License</li>
                  <li>• PAN of Proprietor</li>
                  <li>• Verified Company Profile</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-3">✅ Quality Promise:</h3>
                <p className="text-black">
                  Your food is never subjected to artificial preservation or harmful processing. We ensure that it reaches you with the same freshness and care as when it was prepared.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-3">✅ Delivery Guarantee:</h3>
                <p className="text-black">
                  If your food is delayed beyond 2 days, we provide a 100% refund—no questions asked.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-black mb-3">Get in Contact:</h3>
                <div className="space-y-2">
                  <p className="text-black">
                    <span className="font-medium">Email:</span> support@gharkakhaana.co
                  </p>
                  <p className="text-black">
                    <span className="font-medium">Phone:</span> +91 88888 88888
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={closeContactModal}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
