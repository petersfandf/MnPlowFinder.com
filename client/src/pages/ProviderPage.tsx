import { useRoute, Link } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import providersData from "@/data/providers.json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Globe, MapPin, Check, Clock, Truck, Shield, Star, ShieldCheck } from "lucide-react";
import { Provider } from "@/components/ProviderCard";
import { canRevealPhone, recordPhoneReveal, decodePhone } from "@/lib/utils";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

import { slugify } from "@/lib/utils";

export function ProviderPage({ provider: propProvider }: { provider?: Provider }) {
  const [match, params] = useRoute("/provider/:id/:slug");
  
  let provider = propProvider;
  let id = provider?.id || 0;
  
  if (!provider) {
    id = parseInt(params?.id || "0");
    provider = providersData.find(p => p.id === id) as Provider | undefined;
  }

  // Construct Canonical URL
  // This ensures that whether we are on /glander-excavating or /provider/13/glander-excavating
  // The canonical tag ALWAYS points to the long, official version.
  const canonicalUrl = provider 
    ? `https://mnplowfinder.com/provider/${provider.id}/${slugify(provider.name)}`
    : undefined;

  // State for press-and-hold functionality
  const [showPhone, setShowPhone] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [decodedPhoneNumber, setDecodedPhoneNumber] = useState<string>("");
  
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
        const phone = provider?.phoneEncoded ? decodePhone(provider.phoneEncoded) : provider?.phone || "";
        setDecodedPhoneNumber(phone);

        setShowPhone(true);
        setIsPressing(false);
        setProgress(100);
        
        // Trigger vibration if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <SEO title="Provider Not Found | MN Plow Finder" />
        <Navigation />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
          <Link href="/"><Button>Go Back Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO 
        title={`${provider.name} | Snow Removal in ${provider.city}`} 
        description={provider.description.substring(0, 160)} 
        canonical={canonicalUrl}
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Link href="/">
          <a className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </a>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
              {provider.featured && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">Verified & Insured</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pt-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{provider.name}</h1>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center text-slate-500 gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-lg">Based in <span className="font-semibold text-slate-700">{provider.city}</span></span>
                    </div>
                    {provider.featured && provider.rating && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(provider.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`} 
                            />
                          ))}
                        </div>
                        <span className="font-bold text-slate-900">{provider.rating}</span>
                        <span className="text-slate-500 underline decoration-dotted cursor-help" title="Based on Google Reviews">
                          ({provider.reviewCount} Google Reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {provider.twentyFourSeven && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 px-3 py-1 text-sm mt-2 md:mt-0">
                    <Clock className="h-3 w-3 mr-1" /> 24/7 Service Available
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                 {provider.services.map(service => (
                   <Badge key={service} variant="secondary" className="px-3 py-1 text-sm bg-slate-100 text-slate-700">
                     {service}
                   </Badge>
                 ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {provider.residential && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Check className="h-4 w-4" /></div>
                    <span className="font-medium text-slate-700">Residential Service</span>
                  </div>
                )}
                {provider.commercial && (
                  <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg border border-slate-200">
                     <div className="bg-slate-200 p-2 rounded-full text-slate-600"><Check className="h-4 w-4" /></div>
                    <span className="font-medium text-slate-700">Commercial Service</span>
                  </div>
                )}
                {provider.ruralDriveways && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                     <div className="bg-amber-100 p-2 rounded-full text-amber-600"><Truck className="h-4 w-4" /></div>
                    <span className="font-medium text-slate-700">Rural Driveways</span>
                  </div>
                )}
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-900 mb-3">About {provider.name}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {provider.description}
                </p>
                <p className="text-slate-600 leading-relaxed mt-4">
                  Serving the greater {provider.city} area including {provider.serviceAreas.join(", ")}. 
                  We are committed to reliable snow removal to keep your property safe and accessible all winter long.
                </p>
              </div>
            </div>
            
            {/* Service Areas */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="text-blue-500" /> Service Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider.serviceAreas.map(area => (
                  <div key={area} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-700 font-medium">
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Contact Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b">Contact Provider</h3>
              
              <div className="space-y-4 mb-6">
                {showPhone ? (
                  <Button size="lg" className="w-full text-base font-bold h-12 bg-blue-600 hover:bg-blue-700 animate-in fade-in zoom-in duration-300" asChild>
                    <a href={`tel:${decodedPhoneNumber}`}>
                      <Phone className="mr-2 h-5 w-5" /> {decodedPhoneNumber}
                    </a>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full text-base font-bold h-12 bg-slate-900 hover:bg-slate-800 relative overflow-hidden select-none touch-none active:scale-[0.98] transition-transform"
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                  >
                    {/* Progress Bar Background */}
                    {isPressing && (
                      <div 
                        className="absolute inset-0 bg-white/20 transition-all duration-75 ease-linear origin-left"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                    <Phone className="mr-2 h-5 w-5 relative z-10" /> 
                    <span className="relative z-10">{isPressing ? "Hold to Reveal..." : "Hold to Reveal Phone"}</span>
                  </Button>
                )}
                
                {provider.website && (
                  <Button variant="outline" size="lg" className="w-full text-base h-12" asChild>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-5 w-5" /> Visit Website
                    </a>
                  </Button>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-500 flex gap-3">
                <Shield className="h-5 w-5 text-slate-400 shrink-0" />
                <p>
                  Always verify insurance and ask for a written estimate before hiring any contractor.
                </p>
              </div>

              <div className="w-full text-center pt-2">
                <Link href={`/claim-listing?id=${provider.id}&name=${encodeURIComponent(provider.name)}`}>
                  <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                    Claim or update this listing
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
