
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CTAProps {
  onOpenRequest?: () => void;
}

const CTA = ({ onOpenRequest }: CTAProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 overflow-hidden bg-secondary">
      {/* Background Image with Tint */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"
        style={{ backgroundImage: 'url("/assets/meat-test.jpg")' }}
      ></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h4 className="text-white font-bold tracking-widest text-sm mb-4 uppercase">{t('home.video.subtitle')}</h4>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8 max-w-3xl mx-auto leading-tight">
          {t('home.video.title')}
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-8 text-lg uppercase font-bold tracking-wider rounded-none">
              {t('home.video.btn_info')}
            </Button>
          </Link>
          <button className="flex items-center gap-3 text-white group hover:text-primary transition-colors">
            <PlayCircle className="w-16 h-16" strokeWidth={1} />
            <span className="font-bold uppercase tracking-wider text-sm text-left">
              {t('home.video.btn_view')}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
