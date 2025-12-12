import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { siteConfig } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ShieldCheck, HelpCircle } from "lucide-react";
import { Link } from "wouter";

export function ClaimListing() {
  const [location] = useLocation();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  
  const providerId = searchParams.get("id");
  const providerName = searchParams.get("name");
  
  // Initialize state with URL params
  const [businessName, setBusinessName] = useState(providerName || "");
  
  useEffect(() => {
    // If name changes in URL, update state
    if (providerName) setBusinessName(providerName);
  }, [providerName]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Basic Info
    const bName = formData.get('businessName') as string;
    const cName = formData.get('contactName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string;
    
    // Checkboxes
    const updatePhone = formData.get('updatePhone') === 'on';
    const removePhone = formData.get('removePhone') === 'on';
    
    // Availability
    const availability = formData.get('availability') as string;
    
    // Notes
    const notes = formData.get('notes') as string;

    // Construct email body
    const emailBody = [
      `Claim / Update Request for: ${bName} (ID: ${providerId || "New"})`,
      "------------------------",
      `Contact Name: ${cName}`,
      `Contact Email: ${email}`,
      `Contact Phone: ${phone}`,
      `Website: ${website || "N/A"}`,
      "",
      "Requested Updates:",
      `Update Phone Number: ${updatePhone ? "Yes" : "No"}`,
      `Remove Phone from Public Listing: ${removePhone ? "Yes" : "No"}`,
      "",
      `Availability Status Update: ${availability || "No Change"}`,
      "",
      "Additional Notes / Changes:",
      notes || "None",
      "",
      "------------------------",
      "Please verify this requestor represents the business before making changes."
    ].join('\r\n');
    
    const encodedBody = encodeURIComponent(emailBody);
    const subject = encodeURIComponent(`Listing Update Request: ${bName}`);
    
    window.location.href = `mailto:${siteConfig.providersEmail}?subject=${subject}&body=${encodedBody}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO 
        title="Claim or Update Listing | MN Plow Finder" 
        description="Claim your business listing or request updates to your profile on MN Plow Finder." 
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow max-w-2xl">
        <Link href="/">
          <a className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </a>
        </Link>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Claim or Update Listing</h1>
              <p className="text-slate-500">Verify your information to get the "Verified" badge.</p>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8 text-sm text-slate-600">
            <p className="flex gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500 shrink-0" />
              <span>
                Submitting this form will open your default email client with a pre-filled message. 
                Our team reviews all requests manually to ensure quality and prevent unauthorized changes.
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Business Details</h3>
              
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName" 
                  name="businessName" 
                  defaultValue={businessName} 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Your Name</Label>
                  <Input 
                    id="contactName" 
                    name="contactName" 
                    placeholder="Owner or Manager name"
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="For verification"
                    required 
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Requested Changes</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="updatePhone" name="updatePhone" />
                  <Label htmlFor="updatePhone" className="font-normal cursor-pointer">Update phone number to the one above</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="removePhone" name="removePhone" />
                  <Label htmlFor="removePhone" className="font-normal cursor-pointer text-red-600">Remove phone number from public listing</Label>
                </div>
              </div>
              
              <div className="pt-2">
                <Label className="mb-2 block">Update Availability Status</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                    <input type="radio" name="availability" value="accepting" id="av_accepting" className="text-blue-600" />
                    <Label htmlFor="av_accepting" className="cursor-pointer font-normal">✅ Accepting Clients</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                    <input type="radio" name="availability" value="limited" id="av_limited" className="text-blue-600" />
                    <Label htmlFor="av_limited" className="cursor-pointer font-normal">⚠️ Limited Openings</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                    <input type="radio" name="availability" value="waitlist" id="av_waitlist" className="text-blue-600" />
                    <Label htmlFor="av_waitlist" className="cursor-pointer font-normal">⏳ Waitlist Only</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                    <input type="radio" name="availability" value="closed" id="av_closed" className="text-blue-600" />
                    <Label htmlFor="av_closed" className="cursor-pointer font-normal">⛔ Season Full / Closed</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Changes or Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  placeholder="Tell us what else needs to be updated (e.g., service areas, new services, insurance verification)..."
                  className="mt-1 h-32"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
              Open Email Client to Submit Request
            </Button>
            <p className="text-center text-xs text-slate-400">
              This will launch your default email app with the request details.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
