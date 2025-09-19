"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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

interface MapComponentProps {
  selectedPickupPoint: string | null;
}

export default function MapComponent({ selectedPickupPoint }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      center: [77.2090, 28.6139], // Delhi coordinates
      zoom: 10
    });

    // Add markers for all pickup points
    pickupPoints.forEach((point) => {
      const marker = new maplibregl.Marker({ color: "#3B82F6" })
        .setLngLat([point.longitude, point.latitude])
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<div class="p-2">
              <h3 class="font-semibold">${point.name}</h3>
              <p class="text-sm text-gray-600">${point.address}</p>
            </div>`
          )
        )
        .addTo(map.current!);
      
      markers.current.push(marker);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !selectedPickupPoint) return;

    const selectedPoint = pickupPoints.find(p => p.id === selectedPickupPoint);
    if (selectedPoint) {
      map.current.flyTo({
        center: [selectedPoint.longitude, selectedPoint.latitude],
        zoom: 14,
        essential: true
      });
    }
  }, [selectedPickupPoint]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
