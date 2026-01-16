import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Offers from "@/components/Offers";
import Process from "@/components/Process";
import Values from "@/components/Values";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CertificationRequestForm from "@/components/CertificationRequestForm";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <div className="min-h-screen">
      <Header onOpenRequest={handleOpenModal} />
      <Hero onOpenRequest={handleOpenModal} />
      <Offers onOpenRequest={handleOpenModal} />
      <Process />
      <Values />
      <CTA onOpenRequest={handleOpenModal} />
      <Footer />
      <CertificationRequestForm open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Index;
