'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

// Sample pickup points in Delhi
const pickupPoints = [
  { id: 1, name: "Connaught Place", coordinates: [77.2167, 28.6292] as [number, number], address: "Block A, Connaught Place, New Delhi" },
  { id: 2, name: "India Gate", coordinates: [77.2295, 28.6129] as [number, number], address: "India Gate, Rajpath, New Delhi" },
  { id: 3, name: "Red Fort", coordinates: [77.2410, 28.6562] as [number, number], address: "Netaji Subhash Marg, Chandni Chowk, New Delhi" },
  { id: 4, name: "Karol Bagh Metro", coordinates: [77.1925, 28.6506] as [number, number], address: "Karol Bagh Metro Station, New Delhi" },
  { id: 5, name: "Rajouri Garden", coordinates: [77.1219, 28.6469] as [number, number], address: "Rajouri Garden Metro Station, New Delhi" },
  { id: 6, name: "Dwarka Sector 21", coordinates: [77.0590, 28.5921] as [number, number], address: "Dwarka Sector 21 Metro Station, New Delhi" },
  { id: 7, name: "Nehru Place", coordinates: [77.2482, 28.5495] as [number, number], address: "Nehru Place Metro Station, New Delhi" },
  { id: 8, name: "Lajpat Nagar", coordinates: [77.2431, 28.5687] as [number, number], address: "Lajpat Nagar Central Market, New Delhi" }
];

// Train data from Delhi to Chennai
const trains = [
  {
    id: 1,
    number: "12622",
    name: "Tamil Nadu Express",
    departure: "22:30",
    departureStation: "New Delhi (NDLS)",
    arrival: "07:10",
    arrivalStation: "Chennai Central",
    duration: "≈ 33h 30m",
    frequency: "Daily"
  },
  {
    id: 2,
    number: "12616",
    name: "Grand Trunk Express",
    departure: "16:10",
    departureStation: "New Delhi",
    arrival: "04:45",
    arrivalStation: "Chennai Central",
    duration: "≈ 36h 35m",
    frequency: "Daily"
  },
  {
    id: 3,
    number: "12270",
    name: "Mas Duronto Express",
    departure: "15:55",
    departureStation: "Hazrat Nizamuddin",
    arrival: "20:55",
    arrivalStation: "Chennai Central",
    duration: "≈ 29-30h",
    frequency: "Tue & Sat"
  },
  {
    id: 4,
    number: "12434",
    name: "Rajdhani Express",
    departure: "15:35",
    departureStation: "Hazrat Nizamuddin",
    arrival: "21:00",
    arrivalStation: "Chennai Central",
    duration: "≈ 29h 25m",
    frequency: "Wed & Fri"
  },
  {
    id: 5,
    number: "12612",
    name: "Garib Rath SF Express",
    departure: "15:35",
    departureStation: "Hazrat Nizamuddin",
    arrival: "21:00",
    arrivalStation: "Chennai Central",
    duration: "≈ 29h 25m",
    frequency: "Weekly"
  },
  {
    id: 6,
    number: "22404",
    name: "NDLS-Pondicherry Superfast Exp",
    departure: "23:15",
    departureStation: "New Delhi",
    arrival: "09:25",
    arrivalStation: "Chennai Egmore",
    duration: "≈ 34h 10m",
    frequency: "Weekly (Sun etc.)"
  },
  {
    id: 7,
    number: "16032",
    name: "Andaman Express",
    departure: "14:00",
    departureStation: "New Delhi",
    arrival: "06:50",
    arrivalStation: "Chennai Central",
    duration: "≈ 40-41h",
    frequency: "Sun / Wed / Sat"
  }
];

// Airline data from Delhi to Chennai
const airlines = [
  {
    id: 1,
    airline: "Air India",
    flightNo: "AI2483",
    departure: "12:15",
    arrival: "15:00",
    duration: "2h45m",
    stops: "Nonstop",
    aircraft: "A321"
  },
  {
    id: 2,
    airline: "IndiGo",
    flightNo: "6E123",
    departure: "13:30",
    arrival: "16:15",
    duration: "2h45m",
    stops: "Nonstop",
    aircraft: "A320"
  },
  {
    id: 3,
    airline: "Vistara",
    flightNo: "UK567",
    departure: "15:45",
    arrival: "18:35",
    duration: "2h50m",
    stops: "Nonstop",
    aircraft: "A320"
  },
  {
    id: 4,
    airline: "SpiceJet",
    flightNo: "SG890",
    departure: "18:10",
    arrival: "20:55",
    duration: "2h45m",
    stops: "Nonstop",
    aircraft: "B737"
  }
];

// Cooking instructions
const cookingInstructions = [
  "Sambhar, chappati, Dal, Rice, chicken curry",
  "Don't put too much oil/spice in your food",
  "Don't pack hot food, keep it in cool area for sometime before packing",
  "Don't put food in open space which causes moisture loss"
];

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [fromLocation, setFromLocation] = useState('Delhi');
  const [toLocation, setToLocation] = useState('Chennai');
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [showAirlineModal, setShowAirlineModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<typeof pickupPoints[0] | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<typeof trains[0] | null>(null);
  const [selectedAirline, setSelectedAirline] = useState<typeof airlines[0] | null>(null);
  const [transportMode, setTransportMode] = useState<'train' | 'airline' | null>(null);
  const [items, setItems] = useState<string[]>(['', '', '', '', '']);
  const [trackingId, setTrackingId] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handlePickupPointClick = (point: typeof pickupPoints[0]) => {
    setSelectedPickupPoint(point);
    setShowTransportModal(true);
  };

  const handleTransportModeSelect = (mode: 'train' | 'airline') => {
    setTransportMode(mode);
    setShowTransportModal(false);
    if (mode === 'train') {
      setShowTrainModal(true);
    } else {
      setShowAirlineModal(true);
    }
  };

  const handleTrainSelect = (train: typeof trains[0]) => {
    setSelectedTrain(train);
    setShowTrainModal(false);
    setShowInstructionsModal(true);
  };

  const handleAirlineSelect = (airline: typeof airlines[0]) => {
    setSelectedAirline(airline);
    setShowAirlineModal(false);
    setShowInstructionsModal(true);
  };

  const handleInstructionsNext = () => {
    setShowInstructionsModal(false);
    setShowItemsModal(true);
  };

  const handleItemsSubmit = () => {
    const newTrackingId = 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Prepare order data for localStorage
    const orderData = {
      trackingId: newTrackingId,
      pickupPoint: selectedPickupPoint?.name,
      transport: transportMode === 'train' ? selectedTrain?.name : selectedAirline?.airline,
      transportDetails: transportMode === 'train' ?
        `${selectedTrain?.number} - Dep: ${selectedTrain?.departure}` :
        `${selectedAirline?.flightNo} - Dep: ${selectedAirline?.departure}`,
      items: items.filter(item => item.trim()),
      transportMode,
      createdAt: new Date().toISOString(),
      status: 'Order Confirmed'
    };

    // Store in localStorage
    localStorage.setItem(`order_${newTrackingId}`, JSON.stringify(orderData));

    setTrackingId(newTrackingId);
    setShowItemsModal(false);
    setShowTrackingModal(true);
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleCopyToClipboard = async () => {
    try {
      // Modern approach
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(trackingId);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = trackingId;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (fallbackError) {
          console.error('Fallback copy failed: ', fallbackError);
          alert('Copy failed. Please manually select and copy the tracking ID.');
        } finally {
          document.body.removeChild(textArea);
        }
      }

    } catch (err) {
      console.error('Failed to copy: ', err);
      // Show fallback message
      alert(`Copy failed. Please manually copy this ID: ${trackingId}`);
    }
  };

  const closeModals = () => {
    setShowTransportModal(false);
    setShowTrainModal(false);
    setShowAirlineModal(false);
    setShowInstructionsModal(false);
    setShowItemsModal(false);
    setShowTrackingModal(false);
  };

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    // Configure MapTiler API key from environment variables
    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'YOUR_MAPTILER_API_KEY';

    if (mapContainer.current) {
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [77.2090, 28.6139], // Delhi coordinates
        zoom: 11
      });

      // Add pickup point markers
      pickupPoints.forEach(point => {
        if (map.current) {
          new maptilersdk.Marker({ color: '#FF0000' })
            .setLngLat(point.coordinates)
            .setPopup(new maptilersdk.Popup().setHTML(`<strong>${point.name}</strong><br>${point.address}`))
            .addTo(map.current);
        }
      });
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 p-6 shadow-lg overflow-y-auto">
                <div className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-4">Choose Path</h1>

          {/* From Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">From</label>
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter departure location"
            />
          </div>

          {/* To Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">To</label>
            <input
              type="text"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter destination"
            />
          </div>

          {/* Pickup Points List */}
          <div>
            <h2 className="text-lg font-semibold text-black mb-3">Available Pickup Points</h2>
            <div className="space-y-3">
              {pickupPoints.map((point) => (
                <div
                  key={point.id}
                  className="p-3 bg-white rounded-md border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer hover:bg-blue-50"
                  onClick={() => handlePickupPointClick(point)}
                >
                  <h3 className="font-medium text-black">{point.name}</h3>
                  <p className="text-sm text-black mt-1">{point.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
      </div>

      {/* Train Selection Modal */}
      {showTrainModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                Select Train from {selectedPickupPoint?.name}
              </h2>
              <button
                onClick={closeModals}
                className="text-black hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {trains.map((train) => (
                <div
                  key={train.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleTrainSelect(train)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-black">
                        {train.number} - {train.name}
                      </h3>
                      <p className="text-sm text-black mt-1">{train.frequency}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-blue-100 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {train.departure}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-black">From: </span>
                      <span className="text-black">{train.departureStation}</span>
                    </div>
                    <div>
                      <span className="text-black">To: </span>
                      <span className="text-black">{train.arrivalStation}</span>
                    </div>
                    <div>
                      <span className="text-black">Arrival: </span>
                      <span className="text-black">{train.arrival}</span>
                    </div>
                    <div>
                      <span className="text-black">Duration: </span>
                      <span className="text-black">{train.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

            {/* Transport Mode Selection Modal */}
      {showTransportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                Choose Transport from {selectedPickupPoint?.name}
              </h2>
              <button onClick={closeModals} className="text-black hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="space-y-4">
              <div
                className="border-2 border-blue-200 rounded-lg p-6 hover:bg-blue-50 cursor-pointer transition-colors text-center"
                onClick={() => handleTransportModeSelect('train')}
              >
                <div className="text-4xl mb-2">🚆</div>
                <h3 className="text-xl font-semibold text-black">Train</h3>
                <p className="text-black">Travel by train to Chennai</p>
              </div>
              <div
                className="border-2 border-green-200 rounded-lg p-6 hover:bg-green-50 cursor-pointer transition-colors text-center"
                onClick={() => handleTransportModeSelect('airline')}
              >
                <div className="text-4xl mb-2">✈️</div>
                <h3 className="text-xl font-semibold text-black">Airlines</h3>
                <p className="text-black">Fly to Chennai</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Airline Selection Modal */}
      {showAirlineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Select Flight</h2>
              <button onClick={closeModals} className="text-black hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="space-y-3">
              {airlines.map((airline) => (
                <div
                  key={airline.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-green-50 cursor-pointer transition-colors"
                  onClick={() => handleAirlineSelect(airline)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-black">{airline.airline}</h3>
                      <p className="text-sm text-black">{airline.flightNo}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {airline.departure}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-black">Departure: </span>
                      <span className="text-black">{airline.departure}</span>
                    </div>
                    <div>
                      <span className="text-black">Arrival: </span>
                      <span className="text-black">{airline.arrival}</span>
                    </div>
                    <div>
                      <span className="text-black">Duration: </span>
                      <span className="text-black">{airline.duration}</span>
                    </div>
                    <div>
                      <span className="text-black">Aircraft: </span>
                      <span className="text-black">{airline.aircraft}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Cooking Instructions</h2>
              <button onClick={closeModals} className="text-black hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-black mb-2">Recommended Items:</h3>
                <p className="text-black">{cookingInstructions[0]}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-black">Important Guidelines:</h3>
                {cookingInstructions.slice(1).map((instruction, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <p className="text-black">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleInstructionsNext}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Items Input Modal */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Add Items to Send</h2>
              <button onClick={closeModals} className="text-black hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-black mb-1">
                    Item {index + 1}
                  </label>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder={`Enter item ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleItemsSubmit}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Order
            </button>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Order Tracking</h2>
              <button onClick={closeModals} className="text-black hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="text-center mb-6">
              <div className="bg-green-100 text-black px-4 py-2 rounded-full inline-flex items-center gap-2 text-lg font-semibold mb-4">
                {trackingId}
                <button
                  onClick={handleCopyToClipboard}
                  className="ml-2 p-1 hover:bg-green-200 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copySuccess ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-black mb-2">Your tracking ID has been generated</p>
              <p className="text-sm text-black">
                Use this ID to track your order on the home page
              </p>
            </div>

                        <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-black">Order Confirmed</h3>
                <p className="text-sm text-black">Your order has been placed successfully</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-black">Preparing for Pickup</h3>
                <p className="text-sm text-black">Items are being prepared for collection</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-black">In Transit</h3>
                <p className="text-sm text-black">Your package will be picked up soon</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold text-black">Delivered</h3>
                <p className="text-sm text-black">Package delivered to destination</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Order Summary:</h3>
              <p className="text-sm text-black">Pickup: {selectedPickupPoint?.name}</p>
              <p className="text-sm text-black">
                Transport: {transportMode === 'train' ? selectedTrain?.name : selectedAirline?.airline}
              </p>
              <p className="text-sm text-black">Items: {items.filter(item => item.trim()).length} items</p>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/"
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
              >
                Go to Home Page
              </Link>
              <button
                onClick={closeModals}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
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
