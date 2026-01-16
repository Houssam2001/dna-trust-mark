import { Shield, Eye, FlaskConical, Ban, Award } from "lucide-react";

const values = [
  {
    icon: Eye,
    title: "Unannounced",
    description: "Our checks are carried out without notice to guarantee authentic results.",
  },
  {
    icon: FlaskConical,
    title: "Scientific Proof",
    description: "DNA analysis is the only irrefutable proof of a product's composition.",
  },
  {
    icon: Shield,
    title: "Independence",
    description: "ADNGUARD is completely independent from the establishments being inspected.",
  },
  {
    icon: Ban,
    title: "Zero Compromise",
    description: "No negotiation possible on results. Compliant or non-compliant.",
  },
  {
    icon: Award,
    title: "Customer Visibility",
    description: "The QR code allows each consumer to verify the certification.",
  },
];

const ValuesEN = () => {
  return (
    <section id="values" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              What makes our strength
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ADNGUARD is based on fundamental principles that guarantee the reliability and credibility of our certification.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <value.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
            
            {/* Stats Card */}
            <div className="bg-primary rounded-xl p-6 text-primary-foreground">
              <div className="grid grid-cols-3 gap-4 h-full items-center">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-xs opacity-80">Independent</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">0</div>
                  <div className="text-xs opacity-80">Compromise</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">DNA</div>
                  <div className="text-xs opacity-80">Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesEN;
