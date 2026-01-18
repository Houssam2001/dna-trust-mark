import { Shield, Eye, FlaskConical, Ban, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const Values = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Eye,
      title: t('values.transparency.title'),
      description: t('values.transparency.desc'),
    },
    {
      icon: FlaskConical,
      title: t('values.scientific.title'),
      description: t('values.scientific.desc'),
    },
    {
      icon: Shield,
      title: t('values.independent.title'),
      description: t('values.independent.desc'),
    },
    {
      icon: Ban,
      title: "Zéro Compromis",
      description: "Aucune négociation possible sur les résultats. Conforme ou non conforme.",
    },
    {
      icon: Award,
      title: "Visibilité Client",
      description: "Le QR code permet à chaque consommateur de vérifier la certification.",
    },
  ];

  return (
    <section id="valeurs" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/50 to-transparent -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              {t('nav.values')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0D2B23] uppercase mb-6">
              {t('values.title')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              ADNGUARD repose sur des principes fondamentaux qui garantissent la fiabilité et la crédibilité de notre certification.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Indépendant</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">0</div>
                <div className="text-sm text-muted-foreground">Compromis</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">ADN</div>
                <div className="text-sm text-muted-foreground">Certifié</div>
              </div>
            </div>
          </div>

          {/* Right Content - Values Grid */}
          <div className="space-y-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex items-start gap-5 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <value.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground mb-1">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
