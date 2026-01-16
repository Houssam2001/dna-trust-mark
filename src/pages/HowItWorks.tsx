
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
            icon: Search,
            title: t('process.step1.title'),
            desc: t('process.step1.desc')
        },
        {
            icon: FlaskConical,
            title: t('process.step2.title'),
            desc: t('process.step2.desc')
        },
        {
            icon: Shield,
            title: t('process.step4.title'),
            desc: t('process.step4.desc')
        }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Header onOpenRequest={() => setIsRequestOpen(true)} />

            <section className="bg-primary/5 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                        {t('process.title', 'How It Works')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('process.subtitle', 'A rigorous and scientific process to guarantee authenticity.')}
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="space-y-12">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <step.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <h3 className="text-xl font-bold">{step.title}</h3>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 md:order-2 flex justify-center">
                            <img
                                src="/assets/process-foreground.png"
                                alt="Process"
                                className="max-w-full h-auto drop-shadow-2xl"
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
