import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export function About() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">About MN Plow Finder</h1>
        
        <div className="prose prose-slate lg:prose-lg bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <p className="lead text-xl text-slate-600 mb-6">
            MN Plow Finder is an independent directory dedicated to connecting residents of Southeast Minnesota with local snow removal professionals.
          </p>
          
          <h3>Our Mission</h3>
          <p>
            Living in Minnesota means dealing with snow—lots of it. Finding a reliable plow service shouldn't be harder than shoveling the driveway itself. 
            We created this directory to put all local providers in one easy-to-search place.
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
            <p className="text-slate-700 mb-4">
              Have questions, feedback, or need to update a listing?
            </p>
            <a href="mailto:contact@mnplowfinder.com" className="text-blue-600 font-medium hover:underline">
              contact@mnplowfinder.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
