
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CertificationRequestForm from "@/components/CertificationRequestForm";

const AboutUs = () => {
    const { t } = useTranslation();
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Header onOpenRequest={() => setIsRequestOpen(true)} />

            {/* Who We Are Section (Hero) */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <img
                                src="/assets/service-lab-clean.png"
                                alt="Laboratory Microscope"
                                className="w-full h-auto object-cover rounded-tl-[30px] rounded-br-[30px] shadow-lg"
                                style={{ borderRadius: '20px 0 20px 0' }} // Custom border radius from analysis
                            />
                        </div>
                        <div>
                            <span className="text-[#EB792D] font-bold tracking-wider text-sm mb-2 block uppercase">
                                {t('about.whoAreWeTitle', 'QUI NOUS SOMMES')}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-[#0D2B23] mb-6 leading-tight">
                                {t('about.heroTitle')}
                            </h1>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {t('about.heroDesc')}
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {t('about.whoAreWeDesc', 'Nous rappelons à tous que, même si les restaurants et les boucheries certifiés halal peuvent être concernés, tout est possible en l’absence de contrôle fiable.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24 bg-[#FAFAF8]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#0D2B23] mb-6">
                                {t('about.missionTitle')}
                            </h2>
                            <div className="space-y-6">
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {t('about.missionDesc1')}
                                </p>
                                <ul className="space-y-4 mt-6">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#EB792D] text-xl">✓</span>
                                        <span className="text-gray-700">Détecter toute fraude liée à l’origine de la viande.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#EB792D] text-xl">✓</span>
                                        <span className="text-gray-700">S'assurer de l'absence de porc, de sanglier, de chat, de chien.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#EB792D] text-xl">✓</span>
                                        <span className="text-gray-700">Fournir des preuves scientifiques indépendantes et fiables.</span>
                                    </li>
                                </ul>
                                <p className="text-lg text-gray-600 leading-relaxed mt-6">
                                    {t('about.missionDesc2')}
                                </p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <img
                                src="/assets/service-target-clean.png"
                                alt="Our Mission Target"
                                className="w-full h-auto object-cover rounded-tr-[30px] rounded-bl-[30px] shadow-lg"
                                style={{ borderRadius: '0 20px 0 20px' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Networks Section */}
            {/* <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0D2B23] mb-4">
                            {t('about.networkTitle')}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {t('about.networkDesc')}
                        </p>
                    </div>
                </div>
            </section> */}

            <CertificationRequestForm
                open={isRequestOpen}
                onOpenChange={setIsRequestOpen}
            />
            <Footer />
        </div>
    );
};

export default AboutUs;
