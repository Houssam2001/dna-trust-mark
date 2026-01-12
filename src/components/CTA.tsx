import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import CertificationRequestForm from "./CertificationRequestForm";

const CTA = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-foreground/10 backdrop-blur-sm rounded-full mb-8 border border-primary-foreground/20 animate-pulse-glow">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
            Prêt à afficher votre<br />
            <span className="relative inline-block">
              engagement qualité
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-accent rounded-full" />
            </span>
            ?
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Rejoignez les établissements qui ont choisi la transparence. Obtenez votre certification ADNGUARD dès aujourd'hui.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="xl" onClick={() => setIsFormOpen(true)}>
              Demander le Label
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outlineHero" size="xl">
              Nous contacter
            </Button>
          </div>

          {/* Trust Text */}
          <p className="mt-8 text-primary-foreground/60 text-sm">
            Premier test à tarif préférentiel • Logo offert si conforme
          </p>
        </div>
      </div>

      <CertificationRequestForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </section>
  );
};

export default CTA;
