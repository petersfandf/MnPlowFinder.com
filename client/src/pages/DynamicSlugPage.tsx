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
  
  // Normalize slug: remove trailing slash, lowercase
  const rawSlug = params?.slug || "";
  const slug = rawSlug.toLowerCase().replace(/\/$/, "");

  console.log("DynamicSlugPage: Raw slug:", rawSlug, "Normalized:", slug);

  // 1. Check if it's a City Page
  // Matches "lake-city" or "lake-city-mn-snow-removal"
  const isCity = SUGGESTED_CITIES.some(city => {
    const shortSlug = city.toLowerCase().replace(/\s+/g, '-');
    const longSlug = `${shortSlug}-mn-snow-removal`;
    return slug === shortSlug || slug === longSlug;
  });

  if (isCity) {
    console.log("DynamicSlugPage: Matched city:", slug);
    return <CityPage />;
  }

  // 2. Check if it's a Provider Page
  const provider = providersData.find(p => {
    const pSlug = slugify(p.name);
    // console.log(`Checking provider: ${p.name} -> ${pSlug} === ${slug}`);
    return pSlug === slug;
  }) as Provider | undefined;

  if (provider) {
    console.log("DynamicSlugPage: Matched provider:", provider.name);
    return <ProviderPage provider={provider} />;
  }

  console.warn("DynamicSlugPage: No match found for slug:", slug);

  // 3. Not Found
  return <NotFound />;
}