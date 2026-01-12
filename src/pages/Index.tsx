import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Offers from "@/components/Offers";
import Process from "@/components/Process";
import Values from "@/components/Values";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Offers />
      <Process />
      <Values />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
