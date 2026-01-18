import { useTranslation } from "react-i18next";
import { Utensils, Store, Factory, Truck, ShieldCheck } from "lucide-react";

const TargetAudience = () => {
    const { t } = useTranslation();

    const targets = [
        { label: t('home.target.restaurants'), icon: Utensils },
        { label: t('home.target.butchers'), icon: Store },
        { label: t('home.target.factories'), icon: Factory },
        { label: t('home.target.wholesalers'), icon: Truck },
        { label: t('home.target.brands'), icon: ShieldCheck }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text */}
                    <div>
                        <span className="text-[#EB792D] font-bold tracking-wider text-sm mb-2 block uppercase">
                            {t('home.target.subtitle')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0D2B23] mb-8 leading-tight uppercase">
                            {t('home.target.title')}
                        </h2>

                        <div className="space-y-6">
                            {targets.map((target, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="bg-orange-100 p-3 rounded-full">
                                        <target.icon className="w-6 h-6 text-[#EB792D]" />
                                    </div>
                                    <span className="text-xl text-gray-700 font-medium">
                                        {target.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="relative">
                        <img
                            src="/assets/service-dna-clean.png"
                            alt="Target Audience DNA"
                            className="w-full h-auto rounded-[30px] shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TargetAudience;
