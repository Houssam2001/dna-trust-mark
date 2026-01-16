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
    <section id="process" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            How does ADNGUARD work?
          </h2>
          <p className="text-muted-foreground text-lg">
            A rigorous and transparent process to guarantee the authenticity of your products.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group text-center">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}

                {/* Icon */}
                <div className="relative z-10 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Number */}
                <div className="text-xs font-bold text-primary mb-2">
                  STEP {step.number}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-foreground font-medium text-sm">
              Zero negotiation on results — That's what makes our reputation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessEN;
