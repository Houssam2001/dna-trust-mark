import { Button } from "@/components/ui/button";
import { Shield, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, isAgent } = useAuth();

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

          <nav className="hidden md:flex items-center gap-8">
            <a href="#offres" className="text-muted-foreground hover:text-primary transition-colors font-medium">Nos Offres</a>
            <a href="#process" className="text-muted-foreground hover:text-primary transition-colors font-medium">Comment ça marche</a>
            <a href="#valeurs" className="text-muted-foreground hover:text-primary transition-colors font-medium">Nos Valeurs</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user && (isAdmin || isAgent) ? (
              <Link to="/admin">
                <Button variant="outline" size="lg">Tableau de bord</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="lg"><LogIn className="w-4 h-4 mr-2" />Connexion</Button>
              </Link>
            )}
            <Button variant="hero" size="lg">Obtenir le Label</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a href="#offres" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">Nos Offres</a>
              <a href="#process" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">Comment ça marche</a>
              <a href="#valeurs" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">Nos Valeurs</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium py-2">Contact</a>
              {user && (isAdmin || isAgent) ? (
                <Link to="/admin"><Button variant="outline" className="w-full">Tableau de bord</Button></Link>
              ) : (
                <Link to="/login"><Button variant="ghost" className="w-full"><LogIn className="w-4 h-4 mr-2" />Connexion</Button></Link>
              )}
              <Button variant="hero" size="lg" className="mt-2">Obtenir le Label</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
