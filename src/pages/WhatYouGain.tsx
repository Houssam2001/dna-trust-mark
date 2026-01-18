import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CertificationRequestForm from "@/components/CertificationRequestForm";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const WhatYouGain = () => {
    const { t } = useTranslation();
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    const benefits = [
        {
            title: t('gain.trust.title', 'Unshakable Trust'),
            desc: t('gain.trust.desc', 'By displaying the ADNGUARD label, you prove to your customers that you have nothing to hide. You stand out from competitors who simply make claims without proof.')
        },
        {
            title: t('gain.protection.title', 'Brand Protection'),
            desc: t('gain.protection.desc', 'Protect your reputation from supply chain scandals. Our regular controls ensure that your suppliers remain compliant.')
        },
        {
            title: t('gain.growth.title', 'Business Growth'),
            desc: t('gain.growth.desc', 'Consumers are willing to pay more for certified quality. Increase your customer loyalty and attract new demanding clients.')
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-20 bg-background">
            <Header onOpenRequest={() => setIsRequestOpen(true)} />

            {/* Hero Section */}
            <section className="bg-white py-20 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#0D2B23] uppercase mb-6">
                        {t('gain.title', 'What You Gain')}
                    </h1>
                    <div className="w-24 h-1 bg-[#EB792D] mx-auto mb-8"></div>
                    <p className="text-xl text-[#0D2B23] max-w-2xl mx-auto font-medium">
                        {t('gain.subtitle', 'Tangible benefits for your business and your customers.')}
                    </p>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <img
                                src="/assets/adnguard-sticker.jpg"
                                alt="ADNGUARD Sticker"
                                className="w-full max-w-md mx-auto shadow-2xl rounded-[30px] border-8 border-white"
                            />
                        </div>
                        <div className="space-y-10">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-6">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#EB792D] flex items-center justify-center mt-1">
                                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold mb-3 text-[#0D2B23]">{benefit.title}</h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-6 rounded-none w-full md:w-auto"
                                    onClick={() => setIsRequestOpen(true)}
                                >
                                    {t('hero.cta')}
                                </Button>
                            </div>
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

export default WhatYouGain;
