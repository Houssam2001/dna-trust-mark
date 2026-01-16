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
    <section id="values" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/50 to-transparent -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              What makes our{' '}
              <span className="text-gradient-hero">strength</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              ADNGUARD is based on fundamental principles that guarantee the reliability and credibility of our certification.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Independent</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">0</div>
                <div className="text-sm text-muted-foreground">Compromise</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">DNA</div>
                <div className="text-sm text-muted-foreground">Certified</div>
              </div>
            </div>
          </div>

          {/* Right Content - Values Grid */}
          <div className="space-y-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex items-start gap-5 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <value.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground mb-1">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesEN;
