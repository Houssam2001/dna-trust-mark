import { Button } from "@/components/ui/button";
import { Shield, Menu, X, LogIn, Globe } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "pl", label: "PL", name: "Polski" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ar", label: "AR", name: "العربية" },
  { code: "es", label: "ES", name: "Español" },
  { code: "nl", label: "NL", name: "Nederlands" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "tr", label: "TR", name: "Türkçe" },
];

interface HeaderProps {
  onOpenRequest?: () => void;
}

const Header = ({ onOpenRequest }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, isAgent } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src="/image.png" alt="Logo ADNGUARD" className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xl md:text-2xl font-serif font-bold text-foreground">
              ADN<span className="text-primary">GUARD</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t('nav.home')}</Link>
            <a href="#offres" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t('nav.offers')}</a>
            <a href="#process" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t('nav.process')}</a>
            <a href="#valeurs" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t('nav.values')}</a>
            <Link to="/verification" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t('nav.verification')}</Link>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">{t('nav.contact')}</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={i18n.language === lang.code ? "bg-accent" : ""}
                  >
                    <span className="mr-2 font-bold text-xs">{lang.label}</span> {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (isAdmin || isAgent) ? (
              <Link to="/admin">
                <Button variant="outline" size="lg">{t('nav.dashboard')}</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="lg"><LogIn className="w-4 h-4 mr-2" />{t('nav.login')}</Button>
              </Link>
            )}
            <Button variant="hero" size="lg" onClick={onOpenRequest}>{t('nav.getLabel')}</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={i18n.language === lang.code ? "bg-accent" : ""}
                  >
                    <span className="mr-2 font-bold text-xs">{lang.label}</span> {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
              <a href="#offres" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.offers')}</a>
              <a href="#process" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.process')}</a>
              <a href="#valeurs" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.values')}</a>
              <Link to="/verification" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.verification')}</Link>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t('nav.contact')}</a>
              {user && (isAdmin || isAgent) ? (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}><Button variant="outline" className="w-full">{t('nav.dashboard')}</Button></Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}><Button variant="ghost" className="w-full"><LogIn className="w-4 h-4 mr-2" />{t('nav.login')}</Button></Link>
              )}
              <Button variant="hero" size="lg" className="mt-2" onClick={() => { onOpenRequest?.(); setIsMenuOpen(false); }}>{t('nav.getLabel')}</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
