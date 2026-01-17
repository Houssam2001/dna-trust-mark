
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroProps {
  onOpenRequest?: () => void;
}

const Hero = ({ onOpenRequest }: HeroProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative h-[110dvh] flex items-center overflow-hidden bg-background">
      {/* Background Elements */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mr-auto text-left mb-16 pl-4 md:pl-0">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#BFDBFE]"></div>
            <span className="text-white font-medium text-sm md:text-base tracking-wide">
              {t('hero.highlight')}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight mb-8">
            {t('hero.title')}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-10">
            {t('hero.description')}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Primary Button - Mint */}
            <Button
              onClick={onOpenRequest}
              variant="hero"
              className=" text-white font-bold h-14 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {t('hero.cta')}
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Secondary Button - Outline */}
            <Link to="/how-it-works">
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white h-14 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {t('hero.discover')}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
