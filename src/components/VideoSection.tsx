import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Play } from "lucide-react";

const VideoSection = () => {
    const { t } = useTranslation();

    return (
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="/assets/service-meat-clean.png"
                    alt="DNA Testing Process"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0D2B23]/80" /> {/* Dark Green Overlay */}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 cursor-pointer hover:scale-105 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1 fill-white" />
                    </div>
                </div>

                <h4 className="text-[#EB792D] font-bold tracking-widest text-xs md:text-sm mb-3 md:mb-4 uppercase">
                    {t('home.video.subtitle', 'TEST ADN VIANDE')}
                </h4>

                <h2 className="text-2xl md:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight px-2">
                    {t('home.video.title', "Procédure rapide et sûre de prélèvement d'échantillons à des fins d'analyse.")}
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-[#EB792D] hover:bg-[#EB792D]/90 text-white font-bold px-6 py-5 md:px-8 md:py-6 text-base md:text-lg rounded-xl h-auto"
                    >
                        {t('home.video.btn_info', "Obtenir plus d'informations")}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
