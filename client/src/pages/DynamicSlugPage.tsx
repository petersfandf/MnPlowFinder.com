import { useRoute } from "wouter";
import { SUGGESTED_CITIES } from "@/data/cities";
import providersData from "@/data/providers.json";
import { CityPage } from "./CityPage";
import { ProviderPage } from "./ProviderPage";
import NotFound from "./not-found";
import { slugify } from "@/lib/utils";
import { Provider } from "@/components/ProviderCard";

export function DynamicSlugPage() {
  const [match, params] = useRoute("/:slug");
  const slug = params?.slug || "";

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
  const provider = providersData.find(p => slugify(p.name) === slug) as Provider | undefined;

  if (provider) {
    return <ProviderPage provider={provider} />;
  }

  // 3. Not Found
  return <NotFound />;
}