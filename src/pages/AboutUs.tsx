
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

            {/* Hero Section */}
            <section className="bg-primary/5 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                        {t('about.heroTitle', 'Independent Verification for a Transparent Market')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('about.heroDesc', 'We restore trust between consumers and food professionals through irrefutable scientific proof.')}
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="/assets/mission.jpg"
                                alt="Our Mission"
                                className="rounded-2xl shadow-xl w-full"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">
                                {t('about.missionTitle', 'Rebuilding Trust')}
                            </h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                {t('about.missionDesc1', 'In a globalized market, food fraud is becoming increasingly common. Consumers have lost trust in labels and claims.')}
                            </p>
                            <p className="text-lg text-muted-foreground">
                                {t('about.missionDesc2', 'ADNGUARD was born from a simple observation: only DNA provides absolute certainty about what we eat. We act as an independent third party to verify the authenticity of meat products.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Networks Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-4">
                            {t('about.networkTitle', 'International Laboratory Networks')}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t('about.networkDesc', 'We work with a network of ISO 17025 accredited laboratories across Europe to guarantee the highest reliability of results.')}
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <img
                            src="/assets/lab-networks.png"
                            alt="International Lab Networks"
                            className="max-w-full md:max-w-4xl"
                        />
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

export default AboutUs;
