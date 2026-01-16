
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CertificationRequestForm from "@/components/CertificationRequestForm";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
    const { t } = useTranslation();
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Header onOpenRequest={() => setIsRequestOpen(true)} />

            <section className="bg-primary/5 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                        {t('contact.title', 'Contact Us')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('contact.subtitle', 'Have questions? We are here to help you.')}
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
                        <div className="bg-card p-8 rounded-xl shadow-card border border-border flex flex-col items-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-foreground">{t('contact.email')}</h3>
                            <p className="text-muted-foreground">{t('contact.details.email')}</p>
                        </div>
                        <div className="bg-card p-8 rounded-xl shadow-card border border-border flex flex-col items-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <Phone className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-foreground">{t('contact.phone')}</h3>
                            <p className="text-muted-foreground">{t('contact.details.phone')}</p>
                        </div>
                        <div className="bg-card p-8 rounded-xl shadow-card border border-border flex flex-col items-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <MapPin className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-foreground">{t('contact.address')}</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{t('contact.details.address')}</p>
                        </div>
                        {/* Hours */}
                        <div className="bg-card p-8 rounded-xl shadow-card border border-border flex flex-col items-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-foreground">{t('contact.hours.title')}</h3>
                            <div className="text-muted-foreground text-sm space-y-1">
                                <p>{t('contact.hours.week')}</p>
                                <p>{t('contact.hours.weekend')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Map */}
            <section className="h-96 w-full bg-muted">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.372616677376!2d2.434628776847846!3d48.8510521012187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e672ad0a0b2741%3A0x6a877960662649b3!2s86%20Rue%20Voltaire%2C%2093100%20Montreuil!5e0!3m2!1sen!2sfr!4v1716900000000!5m2!1sen!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ADNGUARD Location"
                ></iframe>
            </section>

            <CertificationRequestForm
                open={isRequestOpen}
                onOpenChange={setIsRequestOpen}
            />
            <Footer />
        </div>
    );
};

export default Contact;
