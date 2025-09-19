"use client";

import { useState } from "react";
import MapComponent from "./MapComponent";
import Sidebar from "./Sidebar";

export default function MapPage() {
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      <Sidebar onPickupPointSelect={setSelectedPickupPoint} />
      <div className="flex-1">
        <MapComponent selectedPickupPoint={selectedPickupPoint} />
      </div>
    </div>
  );
}
