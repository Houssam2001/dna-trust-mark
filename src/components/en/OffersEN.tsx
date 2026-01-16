import { Button } from "@/components/ui/button";
import { Check, Star, Building2, FlaskConical } from "lucide-react";

const offers = [
  {
    id: 1,
    name: "Single Test",
    subtitle: "Discovery",
    description: "A first check to verify your compliance. Perfect for trying our service.",
    icon: FlaskConical,
    features: [
      "1 unannounced sample",
      "1 complete DNA analysis",
      "Official PDF report",
    ],
    cta: "Order a test",
    popular: false,
  },
  {
    id: 2,
    name: "Subscription",
    subtitle: "ADNGUARD",
    description: "The complete solution to display your commitment to quality.",
    icon: Star,
    features: [
      "2 to 4 DNA checks / year",
      "Official reports",
      "ADNGUARD logo & QR code",
      "Online verification page",
    ],
    cta: "Subscribe now",
    popular: true,
  },
  {
    id: 3,
    name: "Premium",
    subtitle: "Industry",
    description: "For factories and large volumes. Custom solutions.",
    icon: Building2,
    features: [
      "Unlimited regular checks",
      "Batch traceability",
      "Dedicated support",
      "Official certification",
    ],
    cta: "Request a quote",
    popular: false,
  },
];

const OffersEN = () => {
  return (
    <section id="offers" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Choose your certification level
          </h2>
          <p className="text-muted-foreground text-lg">
            Solutions adapted to each establishment, from the neighborhood butcher shop to the processing factory.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`relative bg-card rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                offer.popular
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Popular Badge */}
              {offer.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  offer.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <offer.icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {offer.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-3">
                  {offer.subtitle}
                </p>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6">
                  {offer.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {offer.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={offer.popular ? "hero" : "outline"}
                  className="w-full"
                >
                  {offer.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersEN;
