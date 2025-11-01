import * as React from "react";
import { Link } from "react-router-dom";
import { Map, Bell, Users, Compass } from "lucide-react";

export function Navbar(): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 dark:bg-slate-900/95">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-3 font-bold text-lg md:text-xl">
            <div className="rounded-full bg-gradient-to-tr from-primary/10 to-primary/5 text-primary p-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
                <rect x="6" y="9" width="12" height="5" rx="1" />
                <path d="M6 14v3" />
              </svg>
            </div>
            <span className="leading-tight">Atithi Setu</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/live-tracking" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/10 text-sm">
              <Map className="w-4 h-4" /> Live Tracking
            </Link>

            <Link to="/alerts" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/10 text-sm">
              <Bell className="w-4 h-4" /> Alerts
            </Link>

            <Link to="/friend-network" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/10 text-sm">
              <Users className="w-4 h-4" /> Friend Network
            </Link>

            <Link to="/fare-compare" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/10 text-sm">
              <Compass className="w-4 h-4" /> Faring
            </Link>

            <Link to="/hotels" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/10 text-sm">
              {/* Black & white themed hotel icon */}
              <span className="rounded-full bg-white dark:bg-black text-slate-900 dark:text-white p-1.5 inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="18" height="10" rx="1" />
                  <path d="M7 11v4" />
                  <path d="M17 11v4" />
                  <path d="M3 17h18" />
                </svg>
              </span>
              Hotels
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <Link to="/register" className="px-3 py-1.5 rounded bg-primary text-white text-sm">Get Started</Link>
          <Link to="/admin" className="px-3 py-1.5 rounded border bg-white/90 text-sm">Admin</Link>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-md bg-white/90 dark:bg-slate-800">
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background/95 dark:bg-slate-900/95">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
            <Link to="/live-tracking" className="px-3 py-2 rounded hover:bg-muted/10">Live Tracking</Link>
            <Link to="/alerts" className="px-3 py-2 rounded hover:bg-muted/10">Alerts</Link>
            <Link to="/friend-network" className="px-3 py-2 rounded hover:bg-muted/10">Friend Network</Link>
            <Link to="/fare-compare" className="px-3 py-2 rounded hover:bg-muted/10">Faring</Link>
            <Link to="/hotels" className="px-3 py-2 rounded hover:bg-muted/10">Hotels</Link>
            <div className="flex gap-2 mt-2">
              <Link to="/register" className="px-3 py-2 rounded bg-primary text-white">Get Started</Link>
              <Link to="/admin" className="px-3 py-2 rounded border bg-white/90">Admin</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}