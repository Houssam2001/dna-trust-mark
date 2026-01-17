import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FeaturesBar = () => {
    const { t } = useTranslation();

    const features = [
        {
            title: t("home.whyChooseUs.features.environmental.title"),
            desc: t("home.whyChooseUs.features.environmental.desc")
        },
        {
            title: t("home.whyChooseUs.features.foodSafety.title"),
            desc: t("home.whyChooseUs.features.foodSafety.desc")
        },
        {
            title: t("home.whyChooseUs.features.technology.title"),
            desc: t("home.whyChooseUs.features.technology.desc")
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h4 className="text-primary font-bold tracking-widest text-sm mb-4 uppercase">{t("home.whyChooseUs.subtitle")}</h4>
                    <h2 className="text-3xl md:text-4xl font-bold text-gradient-hero mb-8 leading-tight whitespace-pre-line">
                        {t("home.whyChooseUs.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        {t("home.whyChooseUs.desc")}
                    </p>
                    <div className="space-y-6">
                        {features.map((feature, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary text-xl mb-2">{feature.title}</h4>
                                    <p className="text-muted-foreground">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-[40px] overflow-hidden">
                        <img src="/assets/mission.jpg" className="w-full h-full object-cover" alt="Lab Work" />
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -bottom-10 -left-10 bg-primary text-white p-10 rounded-[30px] shadow-2xl hidden md:block">
                        <div className="text-5xl font-bold mb-1">{t("home.whyChooseUs.badge.value")}</div>
                        <div className="text-sm tracking-widest uppercase opacity-80 whitespace-pre-line">{t("home.whyChooseUs.badge.text")}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
