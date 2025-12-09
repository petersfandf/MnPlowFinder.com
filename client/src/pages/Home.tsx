import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProviderCard, Provider } from "@/components/ProviderCard";
import { ProviderMap } from "@/components/ProviderMap";
import providersData from "@/data/providers.json";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, PlusCircle, Map as MapIcon, List } from "lucide-react";
import heroImage from "@assets/generated_images/snowy_residential_street_in_minnesota_winter_with_a_plow_truck_in_distance.png";

export function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Extract unique cities and services for filters
  const cities = useMemo(() => {
    const allCities = providersData.map(p => p.city);
    return Array.from(new Set(allCities)).sort();
  }, []);

  const services = useMemo(() => {
    const allServices = providersData.flatMap(p => p.services);
    return Array.from(new Set(allServices)).sort();
  }, []);

  // Filter providers logic
  const filteredProviders = useMemo(() => {
    return providersData.filter((provider) => {
      const matchesSearch = 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCity === "all" || provider.city === selectedCity;
      
      const matchesService = selectedService === "all" || provider.services.includes(selectedService);

      return matchesSearch && matchesCity && matchesService;
    });
  }, [searchTerm, selectedCity, selectedService]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Snowy Minnesota Road" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-sm">
            Find Snow Removal in <span className="text-blue-400">Southeast Minnesota</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            A simple, free directory connecting residents with local plow services in Lake City, Red Wing, Wabasha, and beyond.
          </p>
          
          {/* Search Box - Hero */}
          <div className="bg-white p-4 rounded-xl shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                placeholder="Search by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 text-slate-700">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        
        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm sticky top-20 z-40">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Filter className="h-5 w-5 text-blue-500" />
            <span>Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
             <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white border-slate-200">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="h-10 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button 
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <List className="h-4 w-4" /> List
                </button>
                <button 
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "map" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <MapIcon className="h-4 w-4" /> Map
                </button>
              </div>
          </div>
          
          <div className="text-sm text-slate-500 w-full sm:w-auto text-right">
            Showing <strong>{filteredProviders.length}</strong> providers
          </div>
        </div>

        {/* Results Grid / Map */}
        {filteredProviders.length > 0 ? (
          viewMode === "list" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {filteredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <ProviderMap providers={filteredProviders} />
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-slate-200 border-dashed">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No providers found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any providers matching your current filters. Try adjusting your search or selecting a different city.
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("all");
                setSelectedService("all");
              }}
              className="mt-4 text-blue-600"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Add Business CTA */}
        <div id="add-business" className="mt-20 bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-12 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlusCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Own a snow removal business?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Get listed in the MN Plow Finder directory for free. Help local residents find you easily during the winter season.
          </p>
          
          <form className="max-w-md mx-auto space-y-4 text-left bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <Input placeholder="Joe's Plowing" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <Input placeholder="555-0123" />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <Input placeholder="Lake City" />
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Services Offered</label>
               <Input placeholder="Driveways, Salting, etc." />
            </div>
            
            <Button className="w-full bg-slate-900 hover:bg-slate-800">Request Listing</Button>
            <p className="text-xs text-center text-slate-400 mt-4">
              This is a demo form. For now, please email addme@mnplowfinder.com
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
