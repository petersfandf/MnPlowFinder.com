import { useRoute, useLocation } from "wouter";
import { SUGGESTED_CITIES } from "@/data/cities";
import providersData from "@/data/providers.json";
import { CityPage } from "./CityPage";
import { ProviderPage } from "./ProviderPage";
import NotFound from "./not-found";
import { slugify } from "@/lib/utils";
import { Provider } from "@/components/ProviderCard";

export function DynamicSlugPage() {
  const [match, params] = useRoute("/:slug");
  const [location] = useLocation();
  
  // Normalize slug: remove trailing slash, lowercase
  const rawSlug = params?.slug || location.split('/').pop() || "";
  const slug = rawSlug.toLowerCase().replace(/\/$/, "");

  console.log("DynamicSlugPage: Raw slug:", rawSlug, "Normalized:", slug, "Location:", location);

  // 1. Check if it's a City Page
  // Matches "lake-city" or "lake-city-mn-snow-removal"
  const isCity = SUGGESTED_CITIES.some(city => {
    const shortSlug = city.toLowerCase().replace(/\s+/g, '-');
    const longSlug = `${shortSlug}-mn-snow-removal`;
    return slug === shortSlug || slug === longSlug;
  });

  if (isCity) {
    return <CityPage />;
  }

  // 2. Check if it's a Provider Page
  const provider = providersData.find(p => {
    const pSlug = slugify(p.name);
    return pSlug === slug;
  }) as Provider | undefined;

  if (provider) {
    return <ProviderPage provider={provider} />;
  }

  // DEBUGGING: If we are in development or explicitly debugging
  // Show why it failed to match
  return (
    <div className="container mx-auto p-8 text-center">
      <NotFound />
      <div className="mt-8 p-4 bg-slate-100 rounded-lg text-left font-mono text-xs overflow-auto max-h-96">
        <p className="font-bold text-red-600 mb-2">Debug Info (Take a screenshot):</p>
        <p>Current Location: {location}</p>
        <p>Raw Slug: {rawSlug}</p>
        <p>Normalized Slug: {slug}</p>
        <p>Match Object: {JSON.stringify(match)}</p>
        <p>Params: {JSON.stringify(params)}</p>
        <hr className="my-2"/>
        <p>Provider Slug Attempts:</p>
        {providersData.slice(0, 5).map(p => (
          <div key={p.id}>{p.name} {"->"} {slugify(p.name)}</div>
        ))}
      </div>
    </div>
  );
}