import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Globe, MapPin, Check, Clock } from "lucide-react";

export interface Provider {
  id: number;
  name: string;
  city: string;
  serviceAreas: string[];
  services: string[];
  residential: boolean;
  commercial: boolean;
  ruralDriveways: boolean;
  twentyFourSeven: boolean;
  phone: string;
  website: string;
  description: string;
}

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200 border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">{provider.name}</CardTitle>
            <div className="flex items-center text-sm text-slate-500 mt-1 gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {provider.city} • Serving: {provider.serviceAreas.join(", ")}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {provider.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.services.map((service) => (
            <Badge key={service} variant="secondary" className="font-normal bg-slate-100 text-slate-700 hover:bg-slate-200">
              {service}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
          {provider.residential && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              <Check className="h-3 w-3" /> Residential
            </span>
          )}
          {provider.commercial && (
            <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
              <Check className="h-3 w-3" /> Commercial
            </span>
          )}
          {provider.twentyFourSeven && (
            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" /> 24/7 Service
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t bg-slate-50/50 flex gap-3">
        <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
          <a href={`tel:${provider.phone}`}>
            <Phone className="mr-2 h-4 w-4" /> Call
          </a>
        </Button>
        {provider.website && (
          <Button variant="outline" asChild className="flex-1 border-slate-200">
            <a href={provider.website} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" /> Website
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
