import { Link, useLocation } from "wouter";
import { Snowflake, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/#add-business", label: "Add Business" },
  ];

  const handleAddBusinessClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    // If we are already on the home page, just scroll
    if (location === "/") {
      const el = document.getElementById("add-business");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        // Update hash without triggering a route change if possible, 
        // or just leave it since we're scrolling
      }
    } else {
      // If we are on another page, navigate to home
      // The user will land on top of home. 
      // Ideally we would scroll down, but for now simple navigation is safer than complex hash state
      setLocation("/");
      // Use a timeout to try scrolling after navigation
      setTimeout(() => {
        const el = document.getElementById("add-business");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 font-heading font-bold text-xl text-primary hover:opacity-80 transition-opacity">
            <Snowflake className="h-6 w-6 fill-current" />
            <span className="text-foreground">MN Plow Finder</span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.href === "/#add-business") {
              return (
                <a
                  key={link.href}
                  href="/#add-business"
                  onClick={handleAddBusinessClick}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link key={link.href} href={link.href}>
                <a
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </a>
              </Link>
            );
          })}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

        {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white p-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
          {navLinks.map((link) => {
            if (link.href === "/#add-business") {
              return (
                <a
                  key={link.href}
                  href="/#add-business"
                  onClick={handleAddBusinessClick}
                  className={cn(
                    "text-base font-medium py-2 px-4 rounded-md hover:bg-muted transition-colors cursor-pointer",
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground"
                  )}
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link key={link.href} href={link.href}>
                <a
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium py-2 px-4 rounded-md hover:bg-muted transition-colors",
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground"
                  )}
                >
                  {link.label}
                </a>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
