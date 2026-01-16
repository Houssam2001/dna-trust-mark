import { FlaskConical, Package, FileCheck, QrCode } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FlaskConical,
    title: "Unannounced Sampling",
    description: "An ADNGUARD agent arrives on-site without notice to collect a sealed sample.",
  },
  {
    number: "02",
    icon: Package,
    title: "Lab Shipment",
    description: "The sample is sent to a certified partner laboratory for DNA analysis.",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Multi-Species Analysis",
    description: "Detection of traces of pork, cat, dog and other undeclared species.",
  },
  {
    number: "04",
    icon: QrCode,
    title: "Certification & QR Code",
    description: "If compliant: official report, ADNGUARD logo and QR code verifiable by your customers.",
  },
];

const ProcessEN = () => {
  return (
    <section id="process" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Our Process
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            How does{' '}
            <span className="text-gradient-hero">ADNGUARD</span> work?
          </h2>
          <p className="text-muted-foreground text-lg">
            A rigorous and transparent process to guarantee the authenticity of your products.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Card */}
                <div className="relative z-10 bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/30 group-hover:-translate-y-1">
                  {/* Number Badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-foreground font-medium">
              Zero negotiation on results — That's what makes our reputation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessEN;
