import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, CheckCircle2, XCircle, Calendar, FlaskConical, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Données de démonstration
const mockEstablishments: Record<string, {
  name: string;
  type: string;
  address: string;
  status: "conforme" | "non_conforme" | "en_attente";
  certifiedSince: string;
  lastControl: string;
  controls: Array<{
    date: string;
    result: "conforme" | "non_conforme";
    species: string[];
    reportId: string;
  }>;
}> = {
  "ADN-2024-001": {
    name: "Boucherie El Baraka",
    type: "Boucherie",
    address: "45 Rue de la République, 75011 Paris",
    status: "conforme",
    certifiedSince: "Mars 2024",
    lastControl: "10 Janvier 2026",
    controls: [
      { date: "10 Janvier 2026", result: "conforme", species: ["Bœuf", "Agneau", "Poulet"], reportId: "RPT-2026-0142" },
      { date: "15 Septembre 2025", result: "conforme", species: ["Bœuf", "Veau"], reportId: "RPT-2025-0891" },
      { date: "20 Mai 2025", result: "conforme", species: ["Agneau", "Poulet"], reportId: "RPT-2025-0423" },
      { date: "12 Janvier 2025", result: "conforme", species: ["Bœuf", "Agneau"], reportId: "RPT-2025-0089" },
    ],
  },
  "ADN-2024-002": {
    name: "Restaurant Le Kebab d'Or",
    type: "Restaurant",
    address: "12 Avenue Jean Jaurès, 93000 Bobigny",
    status: "conforme",
    certifiedSince: "Juin 2024",
    lastControl: "5 Décembre 2025",
    controls: [
      { date: "5 Décembre 2025", result: "conforme", species: ["Bœuf", "Poulet"], reportId: "RPT-2025-1203" },
      { date: "18 Août 2025", result: "conforme", species: ["Agneau"], reportId: "RPT-2025-0756" },
    ],
  },
  "ADN-2023-015": {
    name: "Boucherie Halal du Marché",
    type: "Boucherie",
    address: "8 Place du Marché, 69003 Lyon",
    status: "non_conforme",
    certifiedSince: "Janvier 2023",
    lastControl: "22 Novembre 2025",
    controls: [
      { date: "22 Novembre 2025", result: "non_conforme", species: ["Traces non déclarées détectées"], reportId: "RPT-2025-1156" },
      { date: "14 Juillet 2025", result: "conforme", species: ["Bœuf", "Agneau"], reportId: "RPT-2025-0645" },
      { date: "3 Mars 2025", result: "conforme", species: ["Poulet", "Dinde"], reportId: "RPT-2025-0234" },
    ],
  },
};

const Verification = () => {
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<typeof mockEstablishments[string] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const code = searchCode.toUpperCase().trim();
    
    if (mockEstablishments[code]) {
      setSearchResult(mockEstablishments[code]);
      setNotFound(false);
    } else {
      setSearchResult(null);
      setNotFound(true);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "conforme":
        return {
          label: "Certifié Conforme",
          icon: CheckCircle2,
          bgClass: "bg-primary/10",
          textClass: "text-primary",
          borderClass: "border-primary/30",
        };
      case "non_conforme":
        return {
          label: "Non Conforme",
          icon: XCircle,
          bgClass: "bg-destructive/10",
          textClass: "text-destructive",
          borderClass: "border-destructive/30",
        };
      default:
        return {
          label: "En Attente",
          icon: Clock,
          bgClass: "bg-accent/10",
          textClass: "text-accent-foreground",
          borderClass: "border-accent/30",
        };
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary-foreground" />
            <span className="text-2xl font-serif font-bold text-primary-foreground">
              ADN<span className="text-accent">GUARD</span>
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-2">
            Vérification de Certification
          </h1>
          <p className="text-primary-foreground/80 max-w-xl">
            Entrez le code ADNGUARD de l'établissement pour vérifier son statut de certification et consulter l'historique des contrôles ADN.
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border">
              <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
                Code ADNGUARD de l'établissement
              </label>
              <div className="flex gap-3">
                <Input
                  id="code"
                  type="text"
                  placeholder="Ex: ADN-2024-001"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1 h-12 text-lg"
                />
                <Button type="submit" variant="hero" size="lg">
                  <Search className="w-5 h-5 mr-2" />
                  Vérifier
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mt-3">
                Le code se trouve sur le sticker ADNGUARD affiché dans l'établissement ou sur le QR code.
              </p>
            </form>

            {/* Demo codes hint */}
            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                Codes de démonstration : <code className="bg-muted px-2 py-1 rounded text-xs">ADN-2024-001</code>, <code className="bg-muted px-2 py-1 rounded text-xs">ADN-2024-002</code>, <code className="bg-muted px-2 py-1 rounded text-xs">ADN-2023-015</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {notFound ? (
                <div className="bg-card rounded-2xl shadow-card p-8 border border-border text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-2">
                    Établissement non trouvé
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Aucun établissement ne correspond à ce code. Vérifiez que vous avez bien saisi le code affiché sur le sticker ADNGUARD.
                  </p>
                </div>
              ) : searchResult && (
                <div className="space-y-6 animate-fade-up">
                  {/* Status Card */}
                  <div className={`rounded-2xl border-2 ${getStatusConfig(searchResult.status).borderClass} ${getStatusConfig(searchResult.status).bgClass} p-6 md:p-8`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {(() => {
                            const config = getStatusConfig(searchResult.status);
                            const Icon = config.icon;
                            return <Icon className={`w-8 h-8 ${config.textClass}`} />;
                          })()}
                          <span className={`text-2xl font-bold ${getStatusConfig(searchResult.status).textClass}`}>
                            {getStatusConfig(searchResult.status).label}
                          </span>
                        </div>
                        <p className="text-foreground/70">
                          {searchResult.status === "conforme" 
                            ? "Cet établissement a passé avec succès tous les contrôles ADN ADNGUARD."
                            : searchResult.status === "non_conforme"
                            ? "Le dernier contrôle ADN a révélé des non-conformités. La certification est suspendue."
                            : "Un contrôle est en cours d'analyse."}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-card rounded-xl flex items-center justify-center shadow-md">
                          <Shield className={`w-12 h-12 ${getStatusConfig(searchResult.status).textClass}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Establishment Info */}
                  <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-1">
                      {searchResult.name}
                    </h2>
                    <span className="inline-block bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full mb-4">
                      {searchResult.type}
                    </span>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Adresse</p>
                          <p className="text-foreground">{searchResult.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Certifié depuis</p>
                          <p className="text-foreground">{searchResult.certifiedSince}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FlaskConical className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Dernier contrôle</p>
                          <p className="text-foreground">{searchResult.lastControl}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control History */}
                  <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
                    <h3 className="text-xl font-serif font-bold text-foreground mb-6">
                      Historique des Contrôles ADN
                    </h3>
                    
                    <div className="space-y-4">
                      {searchResult.controls.map((control, index) => (
                        <div 
                          key={index}
                          className={`relative pl-8 pb-4 ${index < searchResult.controls.length - 1 ? 'border-l-2 border-border ml-2' : 'ml-2'}`}
                        >
                          {/* Timeline dot */}
                          <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${
                            control.result === "conforme" ? "bg-primary" : "bg-destructive"
                          }`} />
                          
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="font-semibold text-foreground">{control.date}</span>
                              <span className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-full ${
                                control.result === "conforme" 
                                  ? "bg-primary/10 text-primary" 
                                  : "bg-destructive/10 text-destructive"
                              }`}>
                                {control.result === "conforme" ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    Conforme
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3" />
                                    Non conforme
                                  </>
                                )}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                Réf: {control.reportId}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Espèces analysées : {control.species.join(", ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Footer */}
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm">
                      Données certifiées par ADNGUARD • Contrôles ADN indépendants
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Verification;
