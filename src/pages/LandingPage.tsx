import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

function TracksBackdrop() {
  // Simple track motif using CSS background stripes; decorative only
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-15"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--border), var(--border) 2px, transparent 2px, transparent 16px)",
      }}
    />
  );
}

function Hero() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <section className="relative isolate bg-foreground text-background">
      <TracksBackdrop />
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-background/70">INDIAN RAILWAYS</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight md:text-6xl">Bharat Rail Control</h1>
          <p className="mt-4 text-pretty text-background/80 md:text-lg">
            A modern command view for stations, corridors, and yards—designed for speed, clarity, and precision.
          </p>
          <div className="mt-8">
            <Button
              onClick={handleLogin}
              className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:opacity-90 ring-2 ring-offset-2 ring-offset-foreground ring-primary"
            >
              Login
            </Button>
          </div>
        </div>

        {/* Tricolor badge row - subtle, no interaction */}
        <div className="mt-10 flex items-center gap-2">
          <span className="h-1 w-10 rounded-full bg-primary" aria-hidden />
          <span className="h-1 w-10 rounded-full bg-background" aria-hidden />
          <span className="h-1 w-10 rounded-full bg-accent" aria-hidden />
          <span className="sr-only">Saffron, white, and green tricolor motif</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-auto">
      {/* Tricolor bar */}
      <div className="grid grid-cols-3">
        <div className="h-1 bg-primary" aria-hidden />
        <div className="h-1 bg-background" aria-hidden />
        <div className="h-1 bg-accent" aria-hidden />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-4 text-sm text-muted-foreground md:flex-row md:items-center">
          <p className="order-2 md:order-1">© {new Date().getFullYear()} Bharat Rail Control. All rights reserved.</p>
          <nav className="order-1 flex items-center gap-4 md:order-2">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <span aria-hidden>•</span>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <span aria-hidden>•</span>
            <a href="#" className="hover:text-foreground">
              Support
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <Hero />
      <Footer />
    </main>
  );
}