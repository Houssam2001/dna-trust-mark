
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/Offers";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CertificationRequestForm from "@/components/CertificationRequestForm";
import { FeaturesBar } from "@/components/FeaturesBar";
import { SplitInfo } from "@/components/SplitInfo";
import StatsSection from "@/components/StatsSection";
import { useState } from "react";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <div className="min-h-screen bg-background font-sans text-primary">
      <Header onOpenRequest={handleOpenModal} />
      <main>
        <Hero onOpenRequest={handleOpenModal} />
        {/* Adjusted spacing to correct flow after big Hero */}
        <div className="-mt-10 md:-mt-20 relative z-10">
          <ServicesGrid onOpenRequest={handleOpenModal} />
        </div>
        <SplitInfo />
        <StatsSection />
        <FeaturesBar />
        <CTA onOpenRequest={handleOpenModal} />
      </main>
      <Footer />
      <CertificationRequestForm open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Index;
