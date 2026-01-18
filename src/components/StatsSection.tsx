import { useTranslation } from "react-i18next";

const StatsSection = () => {
    const { t } = useTranslation();

    const stats = [
        { value: "45", label: t("stats.scientists") },
        { value: "5400", label: t("stats.testsDone") },
        { value: "10+", label: t("stats.experience") },
        { value: "24", label: t("stats.awards") },
    ];

    return (
        <section className=" bg-primary text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-white/10 py-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter group-hover:text-white/80 transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-sm font-bold tracking-[0.2em]  text-white/60">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const StatsSectionComponent = StatsSection;
export default StatsSection;
