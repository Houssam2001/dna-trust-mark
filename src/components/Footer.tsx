import { Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-2xl font-serif font-bold">
                ADN<span className="text-primary">GUARD</span>
              </span>
            </a>
            <p className="text-secondary-foreground/70 mb-6 max-w-sm">
              Contrôle ADN indépendant pour certifier l'authenticité de la viande. 
              Protégez vos clients, renforcez votre réputation.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <a href="#offres" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  Nos Offres
                </a>
              </li>
              <li>
                <a href="#process" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#valeurs" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  Nos Valeurs
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  Vérifier un QR Code
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Mail className="w-5 h-5 text-primary" />
                contact@adnguard.fr
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Phone className="w-5 h-5 text-primary" />
                01 23 45 67 89
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/70">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/50 text-sm">
            © 2026 ADNGUARD. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-secondary-foreground/50 hover:text-primary transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-secondary-foreground/50 hover:text-primary transition-colors">
              CGU
            </a>
            <a href="#" className="text-secondary-foreground/50 hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
