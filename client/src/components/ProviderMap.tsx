import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Provider } from "@/components/ProviderCard";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cityCoordinates } from "@/constants/cityCoordinates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  onSelectCity?: (city: string) => void;
}

export function ProviderMap({ providers, onSelectCity }: ProviderMapProps) {
  // Center map roughly on SE MN (between Red Wing and Rochester)
  const centerPos: [number, number] = [44.55, -92.4]; 

  // Group providers by city
  const providersByCity: Record<string, Provider[]> = {};

  // Initialize arrays for all known cities
  Object.keys(cityCoordinates).forEach(city => {
    providersByCity[city] = [];
  });

  // Populate providers for each city
  providers.forEach(provider => {
    // Check if provider services any of our known coordinate cities
    // A provider matches if their main city matches OR if it's in their service areas
    const citiesToadd = new Set<string>();
    
    if (cityCoordinates[provider.city]) {
      citiesToadd.add(provider.city);
    }
    
    provider.serviceAreas.forEach(area => {
      if (cityCoordinates[area]) {
        citiesToadd.add(area);
      }
    });

    citiesToadd.forEach(city => {
      providersByCity[city].push(provider);
    });
  });

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
        {Object.keys(cityCoordinates).map((city) => {
          const cityProviders = providersByCity[city] || [];
          if (cityProviders.length === 0) return null;

          // Sort providers: rating desc, reviewCount desc, name asc
          const sortedProviders = [...cityProviders].sort((a, b) => {
             const ratingA = a.rating || 0;
             const ratingB = b.rating || 0;
             if (ratingA !== ratingB) return ratingB - ratingA;
             
             const reviewsA = a.reviewCount || 0;
             const reviewsB = b.reviewCount || 0;
             if (reviewsA !== reviewsB) return reviewsB - reviewsA;
             
             return a.name.localeCompare(b.name);
          });
          
          const topProviders = sortedProviders.slice(0, 3);
          const coords = cityCoordinates[city];

          return (
            <Marker 
              key={city} 
              position={[coords.lat, coords.lng]}
              icon={customIcon}
            >
              <Popup className="min-w-[200px]">
                <div className="p-1">
                  <h3 className="font-bold text-base mb-1 border-b pb-1">{city}</h3>
                  <div className="text-xs text-slate-500 mb-2">
                    {cityProviders.length} provider{cityProviders.length !== 1 ? 's' : ''} nearby
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {topProviders.map(provider => (
                      <div key={provider.id} className="flex flex-col">
                        <span className="font-semibold text-sm text-slate-800 truncate">
                          {provider.name}
                        </span>
                        <div className="flex gap-1 mt-0.5">
                          {provider.residential && <span className="text-[10px] bg-blue-50 text-blue-700 px-1 rounded">Res</span>}
                          {provider.commercial && <span className="text-[10px] bg-slate-100 text-slate-700 px-1 rounded">Comm</span>}
                          {/* {provider.rating && provider.rating > 0 && (
                             <span className="text-[10px] text-yellow-600 flex items-center">★ {provider.rating}</span>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>

                  {onSelectCity && (
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-xs text-blue-600 w-full justify-start font-semibold"
                      onClick={() => onSelectCity(city)}
                    >
                      See all providers serving {city} &rarr;
                    </Button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
