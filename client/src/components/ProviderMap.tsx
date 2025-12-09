import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Provider } from "@/components/ProviderCard";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in React Leaflet
// We have to manually point to the marker images because the bundler can sometimes miss them
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ProviderMapProps {
  providers: Provider[];
}

export function ProviderMap({ providers }: ProviderMapProps) {
  // Center map roughly on SE MN (between Red Wing and Rochester)
  const centerPos: [number, number] = [44.35, -92.4]; 

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-md border border-slate-200 z-0">
      <MapContainer 
        center={centerPos} 
        zoom={9} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {providers.map((provider) => (
          provider.lat && provider.lng && (
            <Marker 
              key={provider.id} 
              position={[provider.lat, provider.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm mb-1">{provider.name}</h3>
                  <p className="text-xs text-slate-600 mb-2">{provider.city}</p>
                  <a href={`/provider/${provider.id}/${provider.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-blue-600 hover:underline">
                    View Profile
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}
