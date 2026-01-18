
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/Offers";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CertificationRequestForm from "@/components/CertificationRequestForm";
import { FeaturesBar } from "@/components/FeaturesBar";
import { SplitInfo } from "@/components/SplitInfo";
import StatsSection from "@/components/StatsSection";
import TargetAudience from "@/components/TargetAudience";
import VideoSection from "@/components/VideoSection";
import { useState } from "react";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <div className="min-h-screen bg-background font-sans text-primary">
      <Header onOpenRequest={handleOpenModal} />
      <main>
        <Hero onOpenRequest={handleOpenModal} />
        <FeaturesBar />
        <SplitInfo />
        <TargetAudience />
        {/* <StatsSection /> */}
        <ServicesGrid onOpenRequest={handleOpenModal} />
        {/* <CTA onOpenRequest={handleOpenModal} /> */}
      </main>
      <Footer />
      <CertificationRequestForm open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Index;
