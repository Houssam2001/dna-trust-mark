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
                        <div className="grid grid-cols-2 gap-4">
                            <img src="/assets/dna-spiral.jpg" className="rounded-[20px] w-full h-64 object-cover" alt="DNA" />
                            <img src="/assets/meat-test.jpg" className="rounded-[20px] w-full h-64 object-cover mt-12" alt="Testing" />
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <h4 className="text-secondary font-bold tracking-widest text-sm mb-4 uppercase">{t("home.automation.subtitle")}</h4>
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight whitespace-pre-line">
                            {t("home.automation.title")}
                        </h2>
                        <p className="text-secondary text-lg leading-relaxed mb-8">
                            {t("home.automation.desc")}
                        </p>
                        <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 mb-8">
                            <h4 className="font-bold text-primary text-xl mb-2">{t("home.automation.didYouKnow.title")}</h4>
                            <p className="text-secondary">
                                {t("home.automation.didYouKnow.desc")}
                            </p>
                        </div>
                        <Link to="/about-us">
                            <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-none text-lg font-bold tracking-wider">
                                {t("common.readMore")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
