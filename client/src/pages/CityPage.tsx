import { useRoute } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProviderCard } from "@/components/ProviderCard";
import providersData from "@/data/providers.json";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, MapPin } from "lucide-react";
import { useMemo } from "react";

// Map of SEO content for specific cities
const cityContent: Record<string, { title: string; description: string; about: string }> = {
  "lake-city": {
    title: "Snow Removal in Lake City, MN",
    description: "Find the best driveway plowing and sidewalk clearing services in Lake City. Local providers for residential and commercial snow removal.",
    about: "Lake City residents know that when winter hits Lake Pepin, the snow can pile up fast. Whether you live downtown or up on the bluffs, keeping your driveway clear is essential for safety. Our directory lists trusted local operators who serve the Lake City area, offering everything from shovel crews for sidewalks to heavy-duty plowing for long driveways."
  },
  "red-wing": {
    title: "Snow Plowing Services in Red Wing, MN",
    description: "Top rated snow removal companies in Red Wing, Minnesota. Get quotes for seasonal contracts or one-time plowing.",
    about: "Red Wing's historic streets and steep hills require experienced snow removal operators. Browse our list of Red Wing based snow plow services to find the right fit for your home or business. Many providers here also offer salting and sanding services to handle the icy conditions common in the river valley."
  },
  "wabasha": {
    title: "Wabasha MN Snow Removal Directory",
    description: "Local snow plow contractors in Wabasha and Kellogg. Residential and commercial winter services.",
    about: "Don't get stuck this winter. Find reliable snow removal services in Wabasha. From the flats near the river to the surrounding rural areas, our listed providers have the equipment to handle Minnesota winters. Support local Wabasha businesses by hiring from our directory."
  },
  "rochester": {
    title: "Snow Removal Providers in Rochester, MN",
    description: "Professional snow plowing and ice management in Rochester, MN. Find residential and commercial services.",
    about: "As the hub of SE MN, Rochester has many snow removal options. We've curated a list of providers who serve Rochester and the surrounding suburbs. Whether you need a quick plow after a 2-inch snow or full-service removal for a commercial lot, you can find a provider here."
  }
};

export function CityPage() {
  const [match, params] = useRoute("/:slug");
  
  // Extract city name from slug (e.g. "lake-city-mn-snow-removal" -> "lake-city")
  // This is a simple heuristic for the mockup
  const slug = params?.slug || "";
  let cityKey = "";
  let cityName = "";

  if (slug.includes("lake-city")) { cityKey = "lake-city"; cityName = "Lake City"; }
  else if (slug.includes("red-wing")) { cityKey = "red-wing"; cityName = "Red Wing"; }
  else if (slug.includes("wabasha")) { cityKey = "wabasha"; cityName = "Wabasha"; }
  else if (slug.includes("rochester")) { cityKey = "rochester"; cityName = "Rochester"; }
  
  const content = cityContent[cityKey];

  const cityProviders = useMemo(() => {
    if (!cityName) return [];
    return providersData.filter(p => 
      p.city === cityName || p.serviceAreas.includes(cityName)
    );
  }, [cityName]);

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <Link href="/"><Button>Go Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <Link href="/">
          <a className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </a>
        </Link>

        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">{content.title}</h1>
            <p className="text-xl text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-6 py-1 bg-white shadow-sm rounded-r-lg">
              {content.about}
            </p>
          </header>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin className="text-blue-500" />
              Featured Providers in {cityName}
            </h2>
            
            {cityProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cityProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No specific providers listed for this area yet. Check back soon!</p>
            )}
          </section>

          <section className="bg-blue-900 text-white p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Do you plow snow in {cityName}?</h2>
            <p className="text-blue-100 mb-6">
              Add your business to our {cityName} directory page for free and get more local customers.
            </p>
            <Link href="/#add-business">
              <Button size="lg" variant="secondary" className="font-bold">
                List Your Business
              </Button>
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
