import { Shield, Mail, Phone, MapPin, ChevronDown, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const FooterEN = () => {
  return (
    <footer id="contact" className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/en" className="flex items-center gap-2 mb-4">
              <Shield className="w-7 h-7 text-primary" />
              <span className="text-xl font-bold text-foreground lowercase">
                <span className="text-primary">adn</span>guard
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Independent DNA control to certify meat authenticity. 
              Protect your customers, strengthen your reputation.
            </p>
            
            {/* Language */}
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <Globe className="w-4 h-4" />
              English
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Products</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Single Test
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Subscription
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Premium
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Verify QR Code
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                contact@adnguard.fr
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                01 23 45 67 89
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 ADNGUARD. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              EULA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterEN;
