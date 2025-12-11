import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Globe, MapPin, Check, Clock, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { siteConfig } from "@/config";

export interface Provider {
  id: number;
  name: string;
  city: string;
  lat?: number;
  lng?: number;
  serviceAreas: string[];
  services: string[];
  residential: boolean;
  commercial: boolean;
  ruralDriveways: boolean;
  twentyFourSeven: boolean;
  phone: string;
  website: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  accepting: boolean;
  limited: boolean;
  waitlist: boolean;
  closed: boolean;
}

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  // Generate a SEO friendly slug
  const slug = provider.name.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Card className={`flex flex-col h-full hover:shadow-md transition-shadow duration-200 ${provider.featured ? 'border-blue-400 shadow-sm ring-1 ring-blue-400/30' : 'border-slate-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {provider.featured && (
                <>
                  <Badge className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    Featured
                  </Badge>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    <ShieldCheck className="h-3 w-3" /> Verified & Insured
                  </div>
                </>
              )}
              {provider.accepting && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                  ✅ Accepting new clients
                </span>
              )}
              {provider.limited && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800">
                  ⚠️ Limited openings
                </span>
              )}
              {provider.waitlist && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                  ⏳ Waitlist only
                </span>
              )}
            </div>
            <Link href={`/provider/${provider.id}/${slug}`}>
              <a className="hover:underline hover:text-blue-600 transition-colors">
                <CardTitle className="text-xl font-bold text-slate-900">{provider.name}</CardTitle>
              </a>
            </Link>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center text-sm text-slate-500 gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {provider.city} • Serving: {provider.serviceAreas.join(", ")}
              </div>
              {provider.featured && provider.rating && (
                /* <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(provider.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-700">{provider.rating}</span>
                  <span className="text-xs text-slate-400">({provider.reviewCount})</span>
                </div> */
                null
              )}
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
      <CardFooter className="pt-3 border-t bg-slate-50/50 flex flex-col gap-2">
        <div className="flex gap-3 w-full">
          <Button asChild className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600">
            <Link href={`/provider/${provider.id}/${slug}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
            <a href={`tel:${provider.phone}`}>
              <Phone className="mr-2 h-4 w-4" /> Call
            </a>
          </Button>
        </div>
        <div className="w-full text-center">
          <a 
            href={`mailto:${siteConfig?.providersEmail || 'providers@mnplowfinder.com'}?subject=Claim or update listing: ${provider.name}&body=I would like to claim and/or feature our listing on MN Plow Finder.%0D%0A%0D%0ABusiness Name: ${provider.name}%0D%0AContact Name:%0D%0APhone: ${provider.phone}%0D%0AWebsite: ${provider.website}%0D%0AProof of insurance available: Yes / No%0D%0A%0D%0AAdditional details:`}
            className="text-xs text-slate-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
          >
            Claim or update this listing
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
