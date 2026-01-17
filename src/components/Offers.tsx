
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface OffersProps {
  onOpenRequest?: () => void;
}

const ServicesGrid = ({ onOpenRequest }: OffersProps) => {
  const { t } = useTranslation();

  const services = [
    {
      title: t("home.services.verification.title"),
      desc: t("home.services.verification.desc"),
      image: "/assets/meat-test.jpg",
      link: "/how-it-works"
    },
    {
      title: t("home.services.inspection.title"),
      desc: t("home.services.inspection.desc"),
      image: "/assets/mission.jpg",
      link: "/how-it-works"
    },
    {
      title: t("home.services.lookup.title"),
      desc: t("home.services.lookup.desc"),
      image: "/assets/dna-spiral.jpg",
      link: "/verification"
    }
  ];

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-end">
          <div>
            <h4 className="text-primary font-bold tracking-widest text-sm mb-4 uppercase">{t("home.services.subtitle")}</h4>
            <h2 className="text-5xl md:text-6xl font-bold text-gradient-hero leading-none uppercase">
              {t("home.services.title")}
            </h2>
          </div>
          {/* <div className="md:text-right">
            <Link to="/services" className="inline-block border-b border-primary pb-1 text-primary font-bold tracking-wider hover:text-primary/80 transition-colors">
              {t("hero.discover")}
            </Link>
          </div> */}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group relative overflow-hidden rounded-[0px] shadow-lg">
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  {service.title}
                </h3>
                <p className="text-white/80 mb-6 line-clamp-2">
                  {service.desc}
                </p>
                <Link to={service.link} className="inline-flex items-center text-white font-bold transition-opacity hover:opacity-80">
                  {t("common.readMore") || "READ MORE"} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
