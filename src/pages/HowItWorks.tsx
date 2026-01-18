
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CertificationRequestForm from "@/components/CertificationRequestForm";
import { Shield, FlaskConical, Search } from "lucide-react";

const HowItWorks = () => {
    const { t } = useTranslation();
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    const steps = [
        {
            title: t('process.step1.title'),
            desc: t('process.step1.desc')
        },
        {
            title: t('process.step2.title'),
            desc: t('process.step2.desc')
        },
        {
            title: t('process.step3.title'),
            desc: t('process.step3.desc')
        },
        {
            title: t('process.step4.title'),
            desc: t('process.step4.desc')
        },
        {
            title: t('process.step5.title'),
            desc: t('process.step5.desc')
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Header onOpenRequest={() => setIsRequestOpen(true)} />

            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Left Column: Title and Steps */}
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-[#0D2B23]  mb-12">
                                {t('process.title')}
                            </h1>

                            <div className="space-y-8">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-[#EB792D] flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">
                                                    {index === 0 || index === steps.length - 1 ? '>>' : '>>'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0D2B23] mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-lg text-gray-600 leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Image */}
                        <div className="relative h-full w-full flex items-center justify-center">
                            <img
                                src="/assets/second-image.jpeg"
                                alt="Meat Processing"
                                className="w-full md:w-[90%] h-auto object-cover rounded-[20px] shadow-2xl border-4 border-white"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <CertificationRequestForm
                open={isRequestOpen}
                onOpenChange={setIsRequestOpen}
            />
            <Footer />
        </div>
    );
};

export default HowItWorks;
