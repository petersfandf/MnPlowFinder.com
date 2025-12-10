import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config";

export function About() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">About MN Plow Finder</h1>
        
        <div className="prose prose-slate lg:prose-lg bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <p className="lead text-xl text-slate-600 mb-6">
            MN Plow Finder is built and maintained by Peters Field & Frontier Enterprises, LLC.
          </p>
          
          <h3>About the Founder</h3>
          <p>
            Founded by Destin Peters, a seasoned engineer with 15 years of experience in advanced product development, the company focuses on practical, boots-on-the-ground solutions for rural communities.
          </p>
          <p>
            MN Plow Finder started as a simple way to help Southeast Minnesota residents find reliable snow removal — but it’s also the first step in a larger rural-service initiative.
          </p>
          <p>
            Future service expansions include rural connectivity support, backup power preparation, and home resilience services.
          </p>

          <h3>For Residents</h3>
          <p>
            This service is completely free for residents. We verify that listings are active businesses in the SE MN region. 
            However, we do not employ these providers. Please always verify insurance and pricing directly with the service provider.
          </p>

          <h3>For Providers</h3>
          <p>
            Our goal is to help your business grow by making you visible to people in your specific service area. 
            Basic listings are free. In the future, we plan to offer featured listings and additional advertising opportunities to help support the site maintenance.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mt-8 not-prose border-l-4 border-blue-500">
            <h4 className="font-bold text-slate-900 mb-2">Contact Us</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">General Inquiries & Residents</p>
                <a href={`mailto:${siteConfig.infoEmail}`} className="text-blue-600 hover:underline">
                  {siteConfig.infoEmail}
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Providers & Partners</p>
                <a href={`mailto:${siteConfig.providersEmail}`} className="text-blue-600 hover:underline">
                  {siteConfig.providersEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
