import { Button } from "@/components/ui/button";
import { Shield, Menu, X, LogIn, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeaderEN = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, isAgent } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/en" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 md:w-9 md:h-9 text-primary transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground lowercase">
              <span className="text-primary">adn</span>guard
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium">
              Products
              <ChevronDown className="w-4 h-4" />
            </button>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Blog</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Support</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Partners</a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="hero" size="default" className="rounded-full px-6">
              Get Certified
            </Button>
            
            {/* Language Selector */}
            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">EN</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {user && (isAdmin || isAgent) ? (
              <Link to="/admin">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Log in
              </Link>
            )}
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
              <a href="#offers" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">Products</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">Blog</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">Support</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">Partners</a>
              <Button variant="hero" className="w-full rounded-full">Get Certified</Button>
              {user && (isAdmin || isAgent) ? (
                <Link to="/admin"><Button variant="outline" className="w-full">Dashboard</Button></Link>
              ) : (
                <Link to="/login"><Button variant="ghost" className="w-full">Log in</Button></Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderEN;
