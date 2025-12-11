import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProviderCard, Provider } from "@/components/ProviderCard";
import { ProviderMap } from "@/components/ProviderMap";
import providersData from "@/data/providers.json";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, MapPin, Filter, PlusCircle, Map as MapIcon, List, ChevronDown, Check, ChevronsUpDown } from "lucide-react";
import heroImage from "@assets/generated_images/snowy_residential_street_in_minnesota_winter_with_a_plow_truck_in_distance.png";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";

const SUGGESTED_CITIES = [
  "Lake City",
  "Red Wing",
  "Wabasha",
  "Rochester",
  "Frontenac",
  "Goodhue",
  "Zumbrota",
  "Cannon Falls",
  "Winona",
  "Plainview"
];

export function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [sortBy, setSortBy] = useState<"recommended" | "name" | "rating">("recommended");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
  // Form state for multi-select cities
  const [formCities, setFormCities] = useState<string[]>([]);
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);

  const toggleCity = (city: string) => {
    setFormCities(current => 
      current.includes(city) 
        ? current.filter(c => c !== city)
        : [...current, city]
    );
  };

  // Helper for availability sort weight
  const getAvailabilityWeight = (status?: string) => {
    switch (status) {
      case 'accepting': return 3;
      case 'limited': return 2;
      case 'waitlist': return 0;
      case 'closed': return -1;
      default: return 1; // unknown
    }
  };

  // Extract unique cities and services for filters
  const cities = useMemo(() => {
    const allCities = (providersData as unknown as Provider[]).map(p => p.city);
    return Array.from(new Set(allCities)).sort();
  }, []);

  const services = useMemo(() => {
    const allServices = (providersData as unknown as Provider[]).flatMap(p => p.services);
    return Array.from(new Set(allServices)).sort();
  }, []);

  // Filter providers logic
  const filteredProviders = useMemo(() => {
    return (providersData as unknown as Provider[]).filter((provider) => {
      const matchesSearch = 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCity === "all" || 
                          provider.city === selectedCity || 
                          provider.serviceAreas.includes(selectedCity);
      
      const matchesService = selectedService === "all" || provider.services.includes(selectedService);

      return matchesSearch && matchesCity && matchesService;
    }).sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      
      /* if (sortBy === "rating") {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      } */

      // Default "recommended" sort: Availability > Featured > Name
      const weightA = getAvailabilityWeight(a.availabilityStatus);
      const weightB = getAvailabilityWeight(b.availabilityStatus);
      
      if (weightA !== weightB) return weightB - weightA;
      
      // Sort featured providers to the top within availability groups
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, selectedCity, selectedService, sortBy]);

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
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm sticky top-16 z-40 mb-8">
          <div className="flex justify-between items-center">
             <div 
               className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer sm:cursor-default select-none"
               onClick={() => setIsFiltersOpen(!isFiltersOpen)}
             >
                <Filter className="h-5 w-5 text-blue-500" />
                <span>Filters</span>
                <span className="sm:hidden text-xs text-muted-foreground ml-2">
                  ({filteredProviders.length} results)
                </span>
                <ChevronDown className={`h-4 w-4 sm:hidden transition-transform duration-200 ${isFiltersOpen ? "rotate-180" : ""}`} />
             </div>
             
             {/* Desktop count (hidden on mobile to save space if collapsed) */}
             <div className="hidden sm:block text-sm text-slate-500">
                Showing <strong>{filteredProviders.length}</strong> providers
             </div>
          </div>

          {/* Collapsible Content */}
          <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 ${isFiltersOpen ? "block" : "hidden sm:flex"}`}>
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

              <div className="w-full sm:w-[180px]">
                <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                  <SelectTrigger className="w-full bg-white border-slate-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    {/* <SelectItem value="rating">Highest Rated</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="h-10 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto justify-center sm:justify-start">
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
          
          <div className="text-sm text-slate-500 w-full sm:w-auto text-right sm:hidden">
            Showing <strong>{filteredProviders.length}</strong> providers
          </div>
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
              <ProviderMap 
                providers={providersData as unknown as Provider[]} 
                onSelectCity={(city) => {
                  setSelectedCity(city);
                  setViewMode("list");
                  // Scroll to top of results
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
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
            Get listed in the {siteConfig.siteName} directory for free. Help local residents find you easily during the winter season.
          </p>
          
          <form 
            className="max-w-xl mx-auto space-y-6 text-left bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              // Basic Info
              const businessName = formData.get('businessName') as string;
              const phone = formData.get('phone') as string;
              const website = formData.get('website') as string;
              // const cityInput = formData.get('city') as string; // Replaced by formCities state
              
              // Capabilities
              const residential = formData.get('residential') === 'on';
              const commercial = formData.get('commercial') === 'on';
              const twentyFourSeven = formData.get('twentyFourSeven') === 'on';
              const ruralDriveways = formData.get('ruralDriveways') === 'on';
              
              // Services Construction
              const servicesList = [];
              if (formData.get('svc_plowing') === 'on') servicesList.push('Driveway plowing');
              if (formData.get('svc_sidewalks') === 'on') servicesList.push('Sidewalk clearing');
              if (formData.get('svc_salting') === 'on') servicesList.push('Salting');
              if (formData.get('svc_snowblowing') === 'on') servicesList.push('Snow blowing');
              
              const otherServices = formData.get('services_other') as string;
              if (otherServices) {
                const others = otherServices.split(',').map(s => s.trim()).filter(Boolean);
                servicesList.push(...others);
              }

              // Availability
              const availability = formData.get('availability') as string;
              
              // Service Areas
              const serviceAreas = formCities.length > 0 ? formCities : [];
              const primaryCity = serviceAreas.length > 0 ? serviceAreas[0] : "";
              
              const insured = formData.get('insured') === 'on';
              
              const notes = formData.get('notes') as string;

              // Construct JSON object for easy copy-paste
              const providerJson = {
                id: "NEXT_ID",
                name: businessName,
                city: primaryCity,
                lat: 0,
                lng: 0,
                serviceAreas: serviceAreas,
                services: servicesList.length > 0 ? servicesList : ["Snow removal"],
                residential: residential,
                commercial: commercial,
                ruralDriveways: ruralDriveways,
                twentyFourSeven: twentyFourSeven,
                insured: insured,
                phone: phone,
                website: website || "",
                description: notes || "New listing.",
                rating: 0,
                reviewCount: 0,
                featured: false,
                availabilityStatus: availability || "closed"
              };

              const jsonString = JSON.stringify(providerJson, null, 2);
              
              // Human readable summary - using \r\n for email client compatibility
              const summary = [
                "New Business Submission:",
                "------------------------",
                `Business Name: ${businessName}`,
                `Phone: ${phone}`,
                `Website: ${website || "N/A"}`,
                `Service Cities: ${serviceAreas.join(', ')}`,
                `Availability: ${availability}`,
                `Insured: ${insured ? "Yes" : "No"}`,
                "",
                "Capabilities:",
                `- Residential: ${residential ? "Yes" : "No"}`,
                `- Commercial: ${commercial ? "Yes" : "No"}`,
                `- 24/7 Service: ${twentyFourSeven ? "Yes" : "No"}`,
                `- Rural Driveways: ${ruralDriveways ? "Yes" : "No"}`,
                "",
                "Services:",
                ...servicesList.map(s => `- ${s}`),
                "",
                "Notes:",
                notes || "N/A",
                "",
                "------------------------",
                "JSON Data for Admin:"
              ].join('\r\n');
              
              // Combine summary and JSON, then encode the whole thing
              const fullBody = `${summary}\r\n${jsonString}`;
              const encodedBody = encodeURIComponent(fullBody);
              
              window.location.href = `mailto:${siteConfig.providersEmail}?subject=${siteConfig.addBusinessSubject}: ${businessName}&body=${encodedBody}`;
            }}
          >
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Business Information</h3>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" name="businessName" placeholder="Joe's Plowing" required className="mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="555-0123" required className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input id="website" name="website" placeholder="https://" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="city-select">Service Cities</Label>
                <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="city-select"
                      variant="outline"
                      role="combobox"
                      aria-expanded={cityPopoverOpen}
                      className="w-full justify-between mt-1 font-normal"
                    >
                      {formCities.length > 0
                        ? `${formCities.length} selected`
                        : "Select cities..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Search cities..." />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          {SUGGESTED_CITIES.map((city) => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={() => toggleCity(city)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formCities.includes(city) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {formCities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formCities.map(city => (
                      <span key={city} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                        {city}
                        <button 
                          type="button" 
                          onClick={() => toggleCity(city)}
                          className="hover:text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {formCities.length === 0 && (
                   <Input 
                      className="hidden" 
                      required 
                      value={formCities.join(',')} 
                      onChange={() => {}}
                      onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please select at least one city')}
                      onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                   />
                )}
                <p className="text-xs text-slate-500 mt-1">Select all cities that you actively serve.</p>
              </div>

              <div className="pt-2">
                <div className="flex items-start space-x-2 bg-slate-50 p-3 rounded-md border border-slate-100">
                  <Checkbox id="insured" name="insured" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="insured" className="font-medium cursor-pointer">
                      Insurance Confirmation
                    </Label>
                    <p className="text-xs text-slate-500">
                      I confirm that I maintain valid liability insurance for the services provided.
                    </p>
                    <p className="text-[10px] text-slate-400 italic mt-1">
                      Note: You may still submit without selecting this option. Listings marked as insured may be featured, prioritized or recommended.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Capabilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="residential" name="residential" defaultChecked />
                  <Label htmlFor="residential" className="font-normal cursor-pointer">Residential</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="commercial" name="commercial" />
                  <Label htmlFor="commercial" className="font-normal cursor-pointer">Commercial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="twentyFourSeven" name="twentyFourSeven" />
                  <Label htmlFor="twentyFourSeven" className="font-normal cursor-pointer">24/7 Service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ruralDriveways" name="ruralDriveways" />
                  <Label htmlFor="ruralDriveways" className="font-normal cursor-pointer">Rural Driveways</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="svc_plowing" name="svc_plowing" defaultChecked />
                  <Label htmlFor="svc_plowing" className="font-normal cursor-pointer">Driveway Plowing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="svc_sidewalks" name="svc_sidewalks" />
                  <Label htmlFor="svc_sidewalks" className="font-normal cursor-pointer">Sidewalk Clearing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="svc_salting" name="svc_salting" />
                  <Label htmlFor="svc_salting" className="font-normal cursor-pointer">Salting / Ice Control</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="svc_snowblowing" name="svc_snowblowing" />
                  <Label htmlFor="svc_snowblowing" className="font-normal cursor-pointer">Snow Blowing</Label>
                </div>
              </div>
              <div>
                 <Label htmlFor="services_other">Other Services</Label>
                 <Input id="services_other" name="services_other" placeholder="Rooftop removal, Hauling, etc." className="mt-1" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Status</h3>
              <div>
                <Label htmlFor="availability">Current Availability</Label>
                <Select name="availability" defaultValue="closed">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepting">Accepting new clients</SelectItem>
                    <SelectItem value="limited">Limited openings</SelectItem>
                    <SelectItem value="waitlist">Waitlist only</SelectItem>
                    <SelectItem value="closed">Season full / not accepting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Additional Notes</h3>
               <div>
                 <Label htmlFor="notes">Notes regarding your business (up to 300 chars)</Label>
                 <textarea 
                    id="notes" 
                    name="notes" 
                    placeholder="e.g. We have been in business for 20 years and specialize in..." 
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    maxLength={300}
                 />
               </div>
            </div>
            
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-lg py-6 shadow-md">
              Generate Request Email
            </Button>
            <p className="text-xs text-center text-slate-400 mt-4">
              This will open your default email client with the data pre-formatted.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
