import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config";

export function Partner() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Partner With Us</h1>
        
        <div className="prose prose-slate lg:prose-lg bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <p className="lead text-xl text-slate-600 mb-6">
            We collaborate with rural service providers, technology companies, and infrastructure organizations interested in serving Southeast Minnesota.
          </p>
          
          <p>
            If your company provides connectivity, backup power, environmental management, home infrastructure products, or related services, we welcome conversations about pilot programs and regional partnerships.
          </p>
          
          <p>
            MN Plow Finder is part of a broader effort by Peters Field & Frontier Enterprises, LLC to support rural resilience and quality of life.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mt-8 not-prose border-l-4 border-blue-500">
            <h4 className="font-bold text-slate-900 mb-2">Explore Partnerships</h4>
            <p className="text-slate-700 mb-4">
              To explore partnerships, please email us directly.
            </p>
            <a href={`mailto:${siteConfig.adminEmail}?subject=Partnership Inquiry`} className="text-blue-600 font-medium hover:underline">
              {siteConfig.adminEmail}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
