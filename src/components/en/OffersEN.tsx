import { Button } from "@/components/ui/button";
import { Check, X, Star, Building2, FlaskConical } from "lucide-react";

const offers = [
  {
    id: 1,
    name: "Single Test",
    subtitle: "Discovery",
    price: "Starting from",
    priceValue: "€149",
    description: "A first check to verify your compliance",
    icon: FlaskConical,
    features: [
      { text: "1 unannounced sample", included: true },
      { text: "1 complete DNA analysis", included: true },
      { text: "Official PDF report", included: true },
      { text: "ADNGUARD logo", included: false },
      { text: "QR code verification", included: false },
    ],
    cta: "Order a test",
    popular: false,
  },
  {
    id: 2,
    name: "Subscription",
    subtitle: "ADNGUARD",
    price: "Starting from",
    priceValue: "€79/month",
    description: "The complete solution to display your commitment",
    icon: Star,
    features: [
      { text: "2 to 4 DNA checks / year", included: true },
      { text: "Official reports", included: true },
      { text: "Official ADNGUARD logo", included: true },
      { text: "Customer QR code", included: true },
      { text: "Online verification page", included: true },
    ],
    cta: "Subscribe now",
    popular: true,
  },
  {
    id: 3,
    name: "Premium",
    subtitle: "Industry",
    price: "On quote",
    priceValue: "Custom",
    description: "For factories and large volumes",
    icon: Building2,
    features: [
      { text: "Unlimited regular checks", included: true },
      { text: "Batch traceability", included: true },
      { text: "Authority export reports", included: true },
      { text: "Dedicated support", included: true },
      { text: "Official certification", included: true },
    ],
    cta: "Request a quote",
    popular: false,
  },
];

const OffersEN = () => {
  return (
    <section id="offers" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Our Offers
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Choose your level of{' '}
            <span className="text-gradient-hero">certification</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Solutions adapted to each establishment, from the neighborhood butcher shop to the processing factory.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`relative bg-gradient-card rounded-2xl border transition-all duration-300 hover:shadow-card-hover ${
                offer.popular
                  ? 'border-primary shadow-card-hover lg:scale-105 z-10'
                  : 'border-border shadow-card hover:border-primary/50'
              }`}
            >
              {/* Popular Badge */}
              {offer.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-accent text-accent-foreground text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4 sm:mb-6 ${
                  offer.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'
                }`}>
                  <offer.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-1">
                  {offer.name}
                </h3>
                <p className="text-primary font-semibold text-sm mb-3 sm:mb-4">
                  {offer.subtitle}
                </p>

                {/* Price */}
                <div className="mb-3 sm:mb-4">
                  <span className="text-muted-foreground text-sm">{offer.price}</span>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{offer.priceValue}</div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4 sm:mb-6">
                  {offer.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {offer.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 sm:gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/50 flex-shrink-0" />
                      )}
                      <span className={`text-sm sm:text-base ${feature.included ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={offer.popular ? "hero" : "outline"}
                  size="lg"
                  className="w-full text-sm sm:text-base"
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
