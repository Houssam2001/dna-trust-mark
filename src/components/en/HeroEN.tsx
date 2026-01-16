import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, QrCode, FlaskConical, Star, Play } from "lucide-react";
import { Link } from "react-router-dom";

const HeroEN = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Reviews Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-muted-foreground text-sm font-medium">
                500+ certified establishments
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-primary font-semibold text-sm">Excellent!</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
              What you eat is verified by DNA. Shields up!
            </h1>

            {/* Feature List */}
            <ul className="space-y-4 mb-8">
              {[
                "Unannounced DNA inspections",
                "Detects all undeclared species",
                "Protects your reputation",
                "Works for butchers, restaurants & factories",
                "QR code verification for your customers",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground text-lg">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button variant="hero" size="xl" className="gap-2">
                <Shield className="w-5 h-5" />
                Request the Label
              </Button>
              <Button variant="outline" size="xl" className="gap-2">
                <Play className="w-5 h-5" />
                Watch video
              </Button>
            </div>

            {/* License text */}
            <p className="text-muted-foreground text-sm">
              By requesting certification you accept the terms of the{' '}
              <a href="#" className="text-primary hover:underline">Service agreement</a>
            </p>
          </div>

          {/* Right Content - Mascot/Illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Shield Icon as main visual */}
              <div className="w-80 h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <Shield className="w-40 h-40 text-primary" strokeWidth={1} />
                    <CheckCircle2 className="w-16 h-16 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-lg">
                <FlaskConical className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-lg">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="mt-16 border-t border-border pt-8">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { label: "Butchers", active: true },
              { label: "Restaurants", active: false },
              { label: "Factories", active: false },
              { label: "Caterers", active: false },
            ].map((tab, index) => (
              <button
                key={index}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  tab.active
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroEN;
