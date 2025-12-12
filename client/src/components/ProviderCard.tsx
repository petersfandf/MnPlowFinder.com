import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Globe, MapPin, Check, Clock, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { siteConfig } from "@/config";
import { canRevealPhone, recordPhoneReveal, decodePhone } from "@/lib/utils";
import { toast } from "sonner"; // Assuming sonner is installed as it was in package list

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
  phone?: string; // Optional now as we might use phoneEncoded
  phoneEncoded?: string; // New field
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
  
  // State for press-and-hold functionality
  const [showPhone, setShowPhone] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [decodedPhoneNumber, setDecodedPhoneNumber] = useState<string>("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const PRESS_DURATION = 800; // ms to hold

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to stop scrolling/selecting on mobile while pressing
    // e.preventDefault(); 
    if (showPhone) return;
    
    setIsPressing(true);
    startTimeRef.current = Date.now();
    
    // Start animation loop
    const animate = () => {
      if (!startTimeRef.current) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / PRESS_DURATION) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= PRESS_DURATION) {
        // Check rate limit first
        const rateCheck = canRevealPhone();
        
        if (!rateCheck.allowed) {
          setIsPressing(false);
          setProgress(0);
          startTimeRef.current = null;
          toast.error(rateCheck.message || "Rate limit exceeded");
          return;
        }

        // Proceed with reveal
        recordPhoneReveal();
        
        // Decode phone number
        const phone = provider.phoneEncoded ? decodePhone(provider.phoneEncoded) : provider.phone || "";
        setDecodedPhoneNumber(phone);
        
        setShowPhone(true);
        setIsPressing(false);
        setProgress(100);
        
        // Trigger vibration if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        
        // Actually click the link after reveal
        window.location.href = `tel:${phone}`;
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handlePressEnd = () => {
    if (showPhone) return;
    
    setIsPressing(false);
    setProgress(0);
    startTimeRef.current = null;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
          
          {showPhone ? (
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white animate-in fade-in zoom-in duration-300">
              <a href={`tel:${decodedPhoneNumber}`}>
                <Phone className="mr-2 h-4 w-4" /> Call Now
              </a>
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 relative overflow-hidden select-none touch-none active:scale-[0.98] transition-transform"
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              // onTouchCancel={handlePressEnd}
            >
              {/* Progress Bar Background */}
              {isPressing && (
                <div 
                  className="absolute inset-0 bg-white/20 transition-all duration-75 ease-linear origin-left"
                  style={{ width: `${progress}%` }}
                />
              )}
              
              <Phone className="mr-2 h-4 w-4 relative z-10" /> 
              <span className="relative z-10">{isPressing ? "Hold..." : "Hold to Call"}</span>
            </Button>
          )}
        </div>
        <div className="w-full text-center">
          <Link href={`/claim-listing?id=${provider.id}&name=${encodeURIComponent(provider.name)}`}>
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
              Claim or update this listing
            </a>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
