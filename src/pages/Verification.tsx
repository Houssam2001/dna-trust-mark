import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, CheckCircle2, XCircle, Calendar, FlaskConical, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { Establishment, Control, CertificationStatus } from "@/types";
import { useTranslation } from "react-i18next";

const Verification = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [searchCode, setSearchCode] = useState(initialCode);
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [controls, setControls] = useState<Control[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleSearch(undefined, initialCode);
    }
  }, [initialCode]);

  const handleSearch = async (e?: React.FormEvent, codeOverride?: string) => {
    if (e) e.preventDefault();
    const code = (codeOverride || searchCode).toUpperCase().trim();

    if (!code) return;

    setLoading(true);
    setHasSearched(true);
    setNotFound(false);
    setEstablishment(null);
    setControls([]);

    try {
      // Use the public verification endpoint
      const response = await api.get<Establishment & { controls: Control[] }>(`/establishments/verify/${code}`);

      const data = response.data;
      if (data) {
        setEstablishment(data);
        setControls(data.controls || []);
      } else {
        setNotFound(true);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: CertificationStatus) => {
    switch (status) {
      case "conforme":
        return {
          label: t('verification.status.compliant'),
          icon: CheckCircle2,
          bgClass: "bg-primary/10",
          textClass: "text-primary",
          borderClass: "border-primary/30",
        };
      case "non_conforme":
        return {
          label: t('verification.status.nonCompliant'),
          icon: XCircle,
          bgClass: "bg-destructive/10",
          textClass: "text-destructive",
          borderClass: "border-destructive/30",
        };
      case "suspendu":
        return {
          label: t('verification.status.suspended'),
          icon: XCircle,
          bgClass: "bg-muted",
          textClass: "text-muted-foreground",
          borderClass: "border-muted-foreground/30",
        };
      case "n_existe_plus":
        return {
          label: t('verification.status.n_existe_plus'),
          icon: XCircle,
          bgClass: "bg-gray-200",
          textClass: "text-gray-500",
          borderClass: "border-gray-300",
        };
      default:
        return {
          label: t('verification.status.pending'),
          icon: Clock,
          bgClass: "bg-accent/10",
          textClass: "text-accent-foreground",
          borderClass: "border-accent/30",
        };
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getEstablishmentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      boucherie: t('types.boucherie'),
      restaurant: t('types.restaurant'),
      usine: t('types.usine'),
      traiteur: t('types.traiteur'),
      autre: t('types.autre'),
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('verification.backHome')}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary-foreground" />
            <span className="text-2xl font-serif font-bold text-primary-foreground">
              ADN<span className="text-accent">GUARD</span>
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-2">
            {t('verification.title')}
          </h1>
          <p className="text-primary-foreground/80 max-w-xl">
            {t('verification.subtitle')}
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => handleSearch(e)} className="bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border">
              <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
                {t('verification.searchLabel')}
              </label>
              <div className="flex gap-3">
                <Input
                  id="code"
                  type="text"
                  placeholder="Ex: ADN-2026-001"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1 h-12 text-lg"
                />
                <Button type="submit" variant="hero" size="lg" disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      {t('verification.searchBtn')}
                    </>
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mt-3">
                {t('verification.searchHint')}
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && !loading && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {notFound ? (
                <div className="bg-card rounded-2xl shadow-card p-8 border border-border text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-2">
                    {t('verification.notFoundTitle')}
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t('verification.notFoundDesc')}
                  </p>
                </div>
              ) : establishment && (
                <div className="space-y-6 animate-fade-up">
                  {/* Status Card */}
                  <div className={`rounded-2xl border-2 ${getStatusConfig(establishment.status).borderClass} ${getStatusConfig(establishment.status).bgClass} p-6 md:p-8`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {(() => {
                            const config = getStatusConfig(establishment.status);
                            const Icon = config.icon;
                            return <Icon className={`w-8 h-8 ${config.textClass}`} />;
                          })()}
                          <span className={`text-2xl font-bold ${getStatusConfig(establishment.status).textClass}`}>
                            {getStatusConfig(establishment.status).label}
                          </span>
                        </div>
                        <p className="text-foreground/70">
                          {establishment.status === "conforme"
                            ? t('verification.statusDesc.compliant')
                            : establishment.status === "non_conforme"
                              ? t('verification.statusDesc.nonCompliant')
                              : establishment.status === "suspendu"
                                ? t('verification.statusDesc.suspended')
                                : establishment.status === "n_existe_plus"
                                  ? t('verification.statusDesc.n_existe_plus')
                                  : t('verification.statusDesc.pending')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-card rounded-xl flex items-center justify-center shadow-md">
                          <Shield className={`w-12 h-12 ${getStatusConfig(establishment.status).textClass}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Establishment Info */}
                  <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-1">
                      {establishment.name}
                    </h2>
                    <span className="inline-block bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full mb-4">
                      {getEstablishmentTypeLabel(establishment.type)}
                    </span>

                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('verification.info.address')}</p>
                          <p className="text-foreground">
                            {establishment.address}
                            {establishment.postalCode && `, ${establishment.postalCode}`} {establishment.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('verification.info.certifiedSince')}</p>
                          <p className="text-foreground">{formatDate(establishment.certifiedSince)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FlaskConical className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('verification.info.lastControl')}</p>
                          <p className="text-foreground">{formatDate(establishment.lastControlDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control History */}
                  <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
                    <h3 className="text-xl font-serif font-bold text-foreground mb-6">
                      {t('verification.history.title')}
                    </h3>

                    {controls.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        {t('verification.history.empty')}
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {controls.map((control, index) => (
                          <div
                            key={control.id}
                            className={`relative pl-8 pb-4 ${index < controls.length - 1 ? 'border-l-2 border-border ml-2' : 'ml-2'}`}
                          >
                            {/* Timeline dot */}
                            <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${control.result === "conforme" ? "bg-primary" : "bg-destructive"
                              }`} />

                            <div className="bg-muted/50 rounded-xl p-4">
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="font-semibold text-foreground">
                                  {formatDate(control.controlDate)}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-full ${control.result === "conforme"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-destructive/10 text-destructive"
                                  }`}>
                                  {control.result === "conforme" ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3" />
                                      {t('verification.status.compliant')}
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3" />
                                      {t('verification.status.nonCompliant')}
                                    </>
                                  )}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {t('verification.history.ref')}: {control.reportId}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {t('verification.history.species')}: {control.speciesAnalyzed?.join(", ") || "-"}
                              </p>
                              {control.anomaliesDetected && (
                                <p className="text-sm text-destructive mt-1">
                                  {t('verification.history.anomalies')}: {control.anomaliesDetected}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trust Footer */}
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm">
                      {t('verification.footer')}
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
