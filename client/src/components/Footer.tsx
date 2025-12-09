import { Snowflake } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-heading font-bold text-xl text-white mb-4">
              <Snowflake className="h-6 w-6 fill-current" />
              <span>MN Plow Finder</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Connecting residents in Southeast Minnesota with reliable local snow removal providers. 
              Simple, free, and community-focused.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Service Areas</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/lake-city-mn-snow-removal"><a className="hover:text-white transition-colors">Lake City Snow Removal</a></Link></li>
              <li><Link href="/red-wing-mn-snow-removal"><a className="hover:text-white transition-colors">Red Wing Snow Removal</a></Link></li>
              <li><Link href="/wabasha-mn-snow-removal"><a className="hover:text-white transition-colors">Wabasha Snow Removal</a></Link></li>
              <li><Link href="/rochester-mn-snow-removal"><a className="hover:text-white transition-colors">Rochester Snow Removal</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">For Providers</h3>
            <p className="text-sm text-slate-400 mb-4">
              Are you a snow removal professional in SE MN? Get listed in our directory for free.
            </p>
            <a href="mailto:addme@mnplowfinder.com" className="inline-block text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md transition-colors">
              Request Listing
            </a>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MN Plow Finder. All rights reserved.</p>
          <p className="mt-2">Not affiliated with any service provider. Verify all services independently.</p>
        </div>
      </div>
    </footer>
  );
}
