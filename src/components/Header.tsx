import { Button } from "@/components/ui/button";
import { Shield, Menu, X, LogIn, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { user, isAdmin, isAgent } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !isScrolled && !isMenuOpen;

  // Dynamic text colors based on scroll state and page
  const textColorClass = !isTransparent ? "text-muted-foreground hover:text-primary" : "text-white/90 hover:text-white";
  const logoTextClass = !isTransparent ? "text-foreground" : "text-white";
  const iconButtonClass = !isTransparent ? "text-foreground hover:text-primary" : "text-white hover:text-white/80";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${!isTransparent
        ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src="/image.png" alt="Logo ADNGUARD" className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform group-hover:scale-110" />
            </div>
            <span className={`text-xl md:text-2xl font-serif font-bold ${logoTextClass} transition-colors`}>
              ADN<span className="text-primary">GUARD</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`${textColorClass} transition-colors font-medium`}>{t('nav.home')}</Link>
            <Link to="/about-us" className={`${textColorClass} transition-colors font-medium`}>{t('nav.about')}</Link>
            <Link to="/how-it-works" className={`${textColorClass} transition-colors font-medium`}>{t('nav.howItWorks')}</Link>
            <Link to="/what-you-gain" className={`${textColorClass} transition-colors font-medium`}>{t('nav.whatYouGain')}</Link>
            <Link to="/verification" className={`${textColorClass} transition-colors font-medium`}>{t('nav.verification')}</Link>
            <Link to="/contact" className={`${textColorClass} transition-colors font-medium`}>{t('nav.contact')}</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`w-10 h-10 rounded-full ${iconButtonClass}`}>
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
                <Button variant="outline" size="lg" className={`${iconButtonClass} border-current`}>{t('nav.dashboard')}</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="lg" className={iconButtonClass}><LogIn className="w-4 h-4 mr-2" />{t('nav.login')}</Button>
              </Link>
            )}
            <Button variant="hero" size="lg" onClick={onOpenRequest}>{t('nav.getLabel')}</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`w-10 h-10 rounded-full ${iconButtonClass}`}>
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
              className={`p-2 ${iconButtonClass} transition-colors`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in bg-background">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-4" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
              <Link to="/about-us" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-4" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>
              <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-4" onClick={() => setIsMenuOpen(false)}>{t('nav.howItWorks')}</Link>
              <Link to="/what-you-gain" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-4" onClick={() => setIsMenuOpen(false)}>{t('nav.whatYouGain')}</Link>
              <Link to="/verification" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-4" onClick={() => setIsMenuOpen(false)}>{t('nav.verification')}</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 px-4" onClick={() => setIsMenuOpen(false)}>{t('nav.contact')}</Link>
              {user && (isAdmin || isAgent) ? (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="px-4"><Button variant="outline" className="w-full">{t('nav.dashboard')}</Button></Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4"><Button variant="ghost" className="w-full"><LogIn className="w-4 h-4 mr-2" />{t('nav.login')}</Button></Link>
              )}
              <div className="px-4">
                <Button variant="hero" size="lg" className="w-full mt-2" onClick={() => { onOpenRequest?.(); setIsMenuOpen(false); }}>{t('nav.getLabel')}</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
