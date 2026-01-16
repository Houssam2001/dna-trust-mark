import { Button } from "@/components/ui/button";
import { Check, X, Star, Building2, FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OffersProps {
  onOpenRequest?: () => void;
}

const Offers = ({ onOpenRequest }: OffersProps) => {
  const { t } = useTranslation();

  const offers = [
    {
      id: 1,
      name: "Test Unique",
      subtitle: "Découverte",
      price: "À partir de",
      priceValue: "149€",
      description: "Un premier contrôle pour vérifier votre conformité",
      icon: FlaskConical,
      features: [
        { text: "1 prélèvement inopiné", included: true },
        { text: "1 analyse ADN complète", included: true },
        { text: "Rapport PDF officiel", included: true },
        { text: "Logo ADNGUARD", included: false },
        { text: "QR code vérification", included: false },
      ],
      cta: t('offers.cta'),
      popular: false,
    },
    {
      id: 2,
      name: t('offers.standard.title'),
      subtitle: "ADNGUARD",
      price: "À partir de",
      priceValue: "79€" + t('offers.standard.period'),
      description: "La solution complète pour afficher votre engagement",
      icon: Star,
      features: [
        { text: t('offers.features.dnaControl'), included: true },
        { text: t('offers.features.certificate'), included: true },
        { text: t('offers.features.sticker'), included: true },
        { text: t('offers.features.platform'), included: true },
        { text: "Page vérification en ligne", included: true },
      ],
      cta: t('offers.cta'),
      popular: true,
    },
    {
      id: 3,
      name: t('offers.premium.title'),
      subtitle: "Industrie",
      price: "Sur devis",
      priceValue: "Personnalisé",
      description: "Pour les usines et grands volumes",
      icon: Building2,
      features: [
        { text: "Contrôles réguliers illimités", included: true },
        { text: "Traçabilité par lots", included: true },
        { text: "Rapports export autorités", included: true },
        { text: t('offers.features.support'), included: true },
        { text: t('offers.features.certificate'), included: true },
      ],
      cta: "Demander un devis",
      popular: false,
    },
  ];

  return (
    <section id="offres" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            {t('nav.offers')}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t('offers.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('offers.subtitle')}
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`relative bg-gradient-card rounded-2xl border transition-all duration-300 hover:shadow-card-hover ${offer.popular
                ? 'border-primary shadow-card-hover lg:scale-105 z-10'
                : 'border-border shadow-card hover:border-primary/50'
                }`}
            >
              {/* Popular Badge */}
              {offer.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-accent text-accent-foreground text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                    Le plus populaire
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4 sm:mb-6 ${offer.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'
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
                  onClick={onOpenRequest}
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

export default Offers;
