import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const SplitInfo = () => {
    const { t } = useTranslation();

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="relative">
                            <img src="/assets/service-lab-clean.png" className="rounded-[20px] w-full h-auto object-cover shadow-lg" alt="Laboratoire" />
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <h4 className="text-primary font-bold tracking-widest text-sm mb-4 uppercase">{t("home.intro.subtitle")}</h4>
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                            {t("home.intro.title_prefix")}
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                            {t("home.intro.desc1")}
                        </p>
                        {/* <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            {t("home.intro.desc2")}
                        </p> */}
                        <Link to="/about-us">
                            <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-xl text-lg font-bold tracking-wider">
                                {t("home.intro.cta")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
