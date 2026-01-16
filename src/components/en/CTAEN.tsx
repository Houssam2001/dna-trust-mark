import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import CertificationRequestForm from "@/components/CertificationRequestForm";

const CTAEN = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <section className="py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Ready to display your quality commitment?
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join the establishments that have chosen transparency. Get your ADNGUARD certification today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="xl" 
              onClick={() => setIsFormOpen(true)}
              className="bg-white text-primary hover:bg-white/90"
            >
              Request the Label
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Contact Us
            </Button>
          </div>

          {/* Trust Text */}
          <p className="mt-6 text-primary-foreground/60 text-sm">
            First test at preferential rate • Logo included if compliant
          </p>
        </div>
      </div>

      <CertificationRequestForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </section>
  );
};

export default CTAEN;
