import { useRoute, Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import providersData from "@/data/providers.json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Globe, MapPin, Check, Clock, Truck, Shield } from "lucide-react";
import { Provider } from "@/components/ProviderCard";

export function ProviderPage() {
  const [match, params] = useRoute("/provider/:id/:slug");
  const id = parseInt(params?.id || "0");
  
  const provider = providersData.find(p => p.id === id) as Provider | undefined;

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
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
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{provider.name}</h1>
                  <div className="flex items-center text-slate-500 gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-lg">Based in <span className="font-semibold text-slate-700">{provider.city}</span></span>
                  </div>
                </div>
                {provider.twentyFourSeven && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 px-3 py-1 text-sm">
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
                <Button size="lg" className="w-full text-base font-bold h-12 bg-blue-600 hover:bg-blue-700" asChild>
                  <a href={`tel:${provider.phone}`}>
                    <Phone className="mr-2 h-5 w-5" /> {provider.phone}
                  </a>
                </Button>
                
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
