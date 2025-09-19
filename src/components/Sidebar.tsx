"use client";

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

const pickupPoints: PickupPoint[] = [
  { id: "1", name: "Connaught Place", address: "Connaught Place, New Delhi", latitude: 28.6315, longitude: 77.2167 },
  { id: "2", name: "India Gate", address: "India Gate, New Delhi", latitude: 28.6129, longitude: 77.2295 },
  { id: "3", name: "Red Fort", address: "Red Fort, New Delhi", latitude: 28.6562, longitude: 77.2410 },
  { id: "4", name: "Chandni Chowk", address: "Chandni Chowk, New Delhi", latitude: 28.6506, longitude: 77.2306 },
  { id: "5", name: "Karol Bagh", address: "Karol Bagh, New Delhi", latitude: 28.6519, longitude: 77.1909 },
  { id: "6", name: "Lajpat Nagar", address: "Lajpat Nagar, New Delhi", latitude: 28.5656, longitude: 77.2431 },
  { id: "7", name: "Nehru Place", address: "Nehru Place, New Delhi", latitude: 28.5494, longitude: 77.2506 },
  { id: "8", name: "Rajouri Garden", address: "Rajouri Garden, New Delhi", latitude: 28.6462, longitude: 77.1210 }
];

interface SidebarProps {
  onPickupPointSelect: (pointId: string) => void;
}

export default function Sidebar({ onPickupPointSelect }: SidebarProps) {
  return (
    <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Trip Details</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="text"
            id="from"
            value="Delhi"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            type="text"
            id="to"
            value="Chennai"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Available Pickup Points</h3>
        <div className="space-y-2">
          {pickupPoints.map((point) => (
            <div
              key={point.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
              onClick={() => onPickupPointSelect(point.id)}
            >
              <div className="font-medium text-sm">{point.name}</div>
              <div className="text-xs text-gray-600 mt-1">{point.address}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
