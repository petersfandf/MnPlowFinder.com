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
  // Robust fallback for trailing slashes where wouter might not match params.slug
  const rawSlug = params?.slug || location.split('/').filter(Boolean).pop() || "";
  const slug = rawSlug.toLowerCase().replace(/\/$/, "");

  // 1. Check if it's a City Page
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

  // 3. Not Found
  return <NotFound />;
}