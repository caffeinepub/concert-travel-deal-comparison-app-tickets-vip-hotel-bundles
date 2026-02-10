import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, Hotel, DollarSign, Sparkles } from 'lucide-react';
import { branding } from '@/config/branding';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <img
                  src={branding.logo.primary}
                  alt={branding.logo.alt}
                  className="h-20 w-20 md:h-24 md:w-24 object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Save Big on Concert Travel
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Compare ticket prices, VIP packages, and hotels in one place. Get the best bundle deals for your concert trips and keep more money for the experience.
              </p>
              {branding.tagline && (
                <p className="text-lg font-medium text-primary italic">
                  {branding.tagline}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/trip-builder' })}
                  className="text-lg px-8 py-6"
                >
                  Start with RouteRally
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/saved' })}
                  className="text-lg px-8 py-6"
                >
                  View CostCompass
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-concert-travel-savings.dim_1600x900.png"
                alt="Concert Travel Savings"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find the best concert travel deals
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ticket className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">1. Enter Event Details</h3>
                <p className="text-muted-foreground">
                  Tell us about your concert, travel dates, and number of travelers
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Hotel className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">2. Add Your Options</h3>
                <p className="text-muted-foreground">
                  Input ticket prices, VIP packages, and hotel rates you've found
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">3. Compare Bundles</h3>
                <p className="text-muted-foreground">
                  See total costs ranked by price and save your favorite options
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              <Sparkles className="h-5 w-5" />
              <span>Smart Savings</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Stop Overpaying for Concert Trips
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you're traveling across town or across the world, {branding.appName} helps you find the best combination of tickets, VIP experiences, and accommodations. Compare official VIP packages or create your own budget-friendly alternatives.
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/trip-builder' })}
              className="mt-8 text-lg px-8 py-6"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
