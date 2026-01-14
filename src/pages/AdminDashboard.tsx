import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Plus,
  Building2,
  FlaskConical,
  Users,
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  Eye,
  Edit,
  Trash2,
  FileText,
  Check,
  X,
  BarChart3,
} from "lucide-react";
import StatisticsPanel from "@/components/admin/StatisticsPanel";
import UserManagement from "@/components/admin/UserManagement";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { generateCertificatePDF } from "@/lib/generateCertificatePDF";
import type { Database } from "@/integrations/supabase/types";

type Establishment = Database["public"]["Tables"]["establishments"]["Row"];
type Control = Database["public"]["Tables"]["controls"]["Row"];
type Certification = Database["public"]["Tables"]["certifications"]["Row"];
type EstablishmentType = Database["public"]["Enums"]["establishment_type"];
type CertificationStatus = Database["public"]["Enums"]["certification_status"];

const AdminDashboard = () => {
  const { user, isAdmin, isAgent, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"establishments" | "controls" | "users" | "stats">("establishments");
  const [statusFilter, setStatusFilter] = useState<"all" | CertificationStatus>("all");
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [controls, setControls] = useState<(Control & { establishment_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [isEstablishmentDialogOpen, setIsEstablishmentDialogOpen] = useState(false);
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);

  // Form states
  const [establishmentForm, setEstablishmentForm] = useState({
    name: "",
    type: "boucherie" as EstablishmentType,
    address: "",
    city: "",
    postal_code: "",
    phone: "",
    email: "",
    siret: "",
  });

  const [controlForm, setControlForm] = useState({
    establishment_id: "",
    result: "en_attente" as CertificationStatus,
    species_analyzed: "",
    species_detected: "",
    anomalies_detected: "",
    notes: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "establishments") {
        const { data, error } = await supabase
          .from("establishments")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEstablishments(data || []);
      } else if (activeTab === "controls") {
        const { data, error } = await supabase
          .from("controls")
          .select(`
            *,
            establishments (name)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setControls(
          (data || []).map((c) => ({
            ...c,
            establishment_name: (c.establishments as { name: string } | null)?.name,
          }))
        );
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Erreur lors du chargement des données: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEstablishment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("establishments").insert([
        {
          ...establishmentForm,
        },
      ]);

      if (error) throw error;

      toast.success("Établissement créé avec succès !");
      setIsEstablishmentDialogOpen(false);
      setEstablishmentForm({
        name: "",
        type: "boucherie",
        address: "",
        city: "",
        postal_code: "",
        phone: "",
        email: "",
        siret: "",
      });
      fetchData();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Erreur: " + err.message);
    }
  };

  const handleCreateControl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("controls").insert([
        {
          establishment_id: controlForm.establishment_id,
          result: controlForm.result,
          species_analyzed: controlForm.species_analyzed.split(",").map((s) => s.trim()).filter(Boolean),
          species_detected: controlForm.species_detected.split(",").map((s) => s.trim()).filter(Boolean),
          anomalies_detected: controlForm.anomalies_detected || null,
          notes: controlForm.notes || null,
          agent_id: user?.id,
        },
      ]);

      if (error) throw error;

      toast.success("Contrôle enregistré avec succès !");
      setIsControlDialogOpen(false);
      setControlForm({
        establishment_id: "",
        result: "en_attente",
        species_analyzed: "",
        species_detected: "",
        anomalies_detected: "",
        notes: "",
      });
      fetchData();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Erreur: " + err.message);
    }
  };

  const handleDeleteEstablishment = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) return;

    try {
      const { error } = await supabase.from("establishments").delete().eq("id", id);
      if (error) throw error;
      toast.success("Établissement supprimé");
      fetchData();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Erreur: " + err.message);
    }
  };

  const handleUpdateStatus = async (establishment: Establishment, newStatus: CertificationStatus) => {
    try {
      const { error } = await supabase
        .from("establishments")
        .update({ status: newStatus })
        .eq("id", establishment.id);

      if (error) throw error;

      // If status is conforme, create a certification
      if (newStatus === "conforme") {
        const validFrom = new Date();
        const validUntil = new Date();
        validUntil.setFullYear(validUntil.getFullYear() + 1);

        const qrCodeUrl = `${window.location.origin}/verification?code=${establishment.adnguard_code}`;

        await supabase.from("certifications").insert([
          {
            establishment_id: establishment.id,
            valid_from: validFrom.toISOString().split("T")[0],
            valid_until: validUntil.toISOString().split("T")[0],
            qr_code: qrCodeUrl,
            is_active: true,
          },
        ]);
      }

      toast.success(`Statut mis à jour: ${newStatus}`);
      setIsStatusDialogOpen(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Erreur: " + err.message);
    }
  };

  const handleDownloadCertificate = async (establishment: Establishment) => {
    // Get the certification data
    const { data: certData } = await supabase
      .from("certifications")
      .select("*")
      .eq("establishment_id", establishment.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Create a temporary canvas to get QR code as data URL
    const canvas = document.createElement("canvas");
    const qrUrl = `${window.location.origin}/verification?code=${establishment.adnguard_code}`;
    
    // Use a hidden QR element
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const QRCodeCanvas = (await import("qrcode.react")).QRCodeCanvas;
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(tempDiv);
    
    await new Promise<void>((resolve) => {
      root.render(
        <QRCodeCanvas
          value={qrUrl}
          size={200}
          level="H"
          includeMargin
          id="temp-qr-canvas"
        />
      );
      setTimeout(resolve, 100);
    });

    const qrCanvas = tempDiv.querySelector("canvas");
    const qrDataUrl = qrCanvas?.toDataURL("image/png") || "";
    
    root.unmount();
    document.body.removeChild(tempDiv);

    generateCertificatePDF({
      establishmentName: establishment.name,
      establishmentType: establishment.type,
      adnguardCode: establishment.adnguard_code || "",
      address: establishment.address,
      city: establishment.city,
      certifiedSince: establishment.certified_since
        ? new Date(establishment.certified_since).toLocaleDateString("fr-FR")
        : undefined,
      validFrom: certData
        ? new Date(certData.valid_from).toLocaleDateString("fr-FR")
        : new Date().toLocaleDateString("fr-FR"),
      validUntil: certData
        ? new Date(certData.valid_until).toLocaleDateString("fr-FR")
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
      qrCodeDataUrl: qrDataUrl,
    });

    toast.success("Certificat PDF généré !");
  };

  const getStatusBadge = (status: CertificationStatus) => {
    const configs = {
      conforme: { icon: CheckCircle2, label: "Conforme", className: "bg-primary/10 text-primary" },
      non_conforme: { icon: XCircle, label: "Non conforme", className: "bg-destructive/10 text-destructive" },
      en_attente: { icon: Clock, label: "En attente", className: "bg-accent/10 text-accent-foreground" },
      suspendu: { icon: XCircle, label: "Suspendu", className: "bg-muted text-muted-foreground" },
    };
    const config = configs[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredEstablishments = establishments.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.adnguard_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = establishments.filter((e) => e.status === "en_attente").length;

  const getQRCodeUrl = (code: string) => {
    return `${window.location.origin}/verification?code=${code}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin && !isAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center p-8 bg-card rounded-2xl shadow-card max-w-md">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">Accès Restreint</h1>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <Link to="/">
            <Button variant="hero">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-serif font-bold">
              ADN<span className="text-primary">GUARD</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user?.email}
            </span>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {isAdmin ? "Admin" : "Agent"}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeTab === "establishments" ? "hero" : "outline"}
            onClick={() => setActiveTab("establishments")}
            className="relative"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Établissements
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === "controls" ? "hero" : "outline"}
            onClick={() => setActiveTab("controls")}
          >
            <FlaskConical className="w-4 h-4 mr-2" />
            Contrôles ADN
          </Button>
          {isAdmin && (
            <Button
              variant={activeTab === "users" ? "hero" : "outline"}
              onClick={() => setActiveTab("users")}
            >
              <Users className="w-4 h-4 mr-2" />
              Utilisateurs
            </Button>
          )}
          {isAdmin && (
            <Button
              variant={activeTab === "stats" ? "hero" : "outline"}
              onClick={() => setActiveTab("stats")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistiques
            </Button>
          )}
        </div>

        {/* Content */}
        {activeTab === "establishments" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, code ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as "all" | CertificationStatus)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="conforme">Conforme</SelectItem>
                    <SelectItem value="non_conforme">Non conforme</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isEstablishmentDialogOpen} onOpenChange={setIsEstablishmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel établissement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter un établissement</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateEstablishment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Nom de l'établissement *</Label>
                        <Input
                          value={establishmentForm.name}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type *</Label>
                        <Select
                          value={establishmentForm.type}
                          onValueChange={(v: EstablishmentType) =>
                            setEstablishmentForm({ ...establishmentForm, type: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="boucherie">Boucherie</SelectItem>
                            <SelectItem value="restaurant">Restaurant</SelectItem>
                            <SelectItem value="usine">Usine</SelectItem>
                            <SelectItem value="traiteur">Traiteur</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>SIRET</Label>
                        <Input
                          value={establishmentForm.siret}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, siret: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Adresse *</Label>
                        <Input
                          value={establishmentForm.address}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, address: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ville *</Label>
                        <Input
                          value={establishmentForm.city}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, city: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Code postal</Label>
                        <Input
                          value={establishmentForm.postal_code}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, postal_code: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input
                          value={establishmentForm.phone}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={establishmentForm.email}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="hero" className="w-full">
                      Créer l'établissement
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Code
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Établissement
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Type
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Ville
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Statut
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredEstablishments.map((establishment) => (
                        <tr key={establishment.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-mono text-sm text-primary">
                            {establishment.adnguard_code}
                          </td>
                          <td className="px-4 py-3 font-medium">{establishment.name}</td>
                          <td className="px-4 py-3 text-sm capitalize">{establishment.type}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {establishment.city}
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(establishment.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {/* Status Update */}
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedEstablishment(establishment);
                                    setIsStatusDialogOpen(true);
                                  }}
                                  title="Modifier le statut"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              {/* QR Code */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedEstablishment(establishment);
                                  setIsQRDialogOpen(true);
                                }}
                                title="Voir le QR Code"
                              >
                                <QrCode className="w-4 h-4" />
                              </Button>
                              {/* View */}
                              <Link to={`/verification?code=${establishment.adnguard_code}`}>
                                <Button variant="ghost" size="icon" title="Voir la page publique">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              {/* Download Certificate */}
                              {establishment.status === "conforme" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownloadCertificate(establishment)}
                                  title="Télécharger le certificat PDF"
                                >
                                  <FileText className="w-4 h-4 text-primary" />
                                </Button>
                              )}
                              {/* Quick Accept/Reject for pending */}
                              {isAdmin && establishment.status === "en_attente" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUpdateStatus(establishment, "conforme")}
                                    title="Accepter"
                                    className="text-primary hover:text-primary"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUpdateStatus(establishment, "non_conforme")}
                                    title="Refuser"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              {/* Delete */}
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteEstablishment(establishment.id)}
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredEstablishments.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    Aucun établissement trouvé
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "controls" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isControlDialogOpen} onOpenChange={setIsControlDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau contrôle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Enregistrer un contrôle ADN</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateControl} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Établissement *</Label>
                      <Select
                        value={controlForm.establishment_id}
                        onValueChange={(v) =>
                          setControlForm({ ...controlForm, establishment_id: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un établissement" />
                        </SelectTrigger>
                        <SelectContent>
                          {establishments.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.adnguard_code} - {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Résultat *</Label>
                      <Select
                        value={controlForm.result}
                        onValueChange={(v: CertificationStatus) =>
                          setControlForm({ ...controlForm, result: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conforme">Conforme</SelectItem>
                          <SelectItem value="non_conforme">Non conforme</SelectItem>
                          <SelectItem value="en_attente">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Espèces analysées (séparées par des virgules)</Label>
                      <Input
                        value={controlForm.species_analyzed}
                        onChange={(e) =>
                          setControlForm({ ...controlForm, species_analyzed: e.target.value })
                        }
                        placeholder="Bœuf, Agneau, Poulet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Espèces détectées (séparées par des virgules)</Label>
                      <Input
                        value={controlForm.species_detected}
                        onChange={(e) =>
                          setControlForm({ ...controlForm, species_detected: e.target.value })
                        }
                        placeholder="Bœuf, Agneau"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Anomalies détectées</Label>
                      <Textarea
                        value={controlForm.anomalies_detected}
                        onChange={(e) =>
                          setControlForm({ ...controlForm, anomalies_detected: e.target.value })
                        }
                        placeholder="Décrivez les anomalies éventuelles..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={controlForm.notes}
                        onChange={(e) =>
                          setControlForm({ ...controlForm, notes: e.target.value })
                        }
                        placeholder="Notes supplémentaires..."
                      />
                    </div>
                    <Button type="submit" variant="hero" className="w-full">
                      Enregistrer le contrôle
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Controls Table */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Réf. Rapport
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Établissement
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Résultat
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Espèces
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {controls.map((control) => (
                        <tr key={control.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-mono text-sm text-primary">
                            {control.report_id}
                          </td>
                          <td className="px-4 py-3 font-medium">{control.establishment_name}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(control.control_date).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(control.result)}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {control.species_analyzed?.join(", ") || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {controls.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    Aucun contrôle enregistré
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && isAdmin && (
          <UserManagement />
        )}

        {activeTab === "stats" && isAdmin && (
          <StatisticsPanel />
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>QR Code de Certification</DialogTitle>
          </DialogHeader>
          {selectedEstablishment && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                <QRCodeSVG
                  value={getQRCodeUrl(selectedEstablishment.adnguard_code || "")}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              <div>
                <p className="font-mono text-lg text-primary font-bold">
                  {selectedEstablishment.adnguard_code}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedEstablishment.name}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Lien de vérification :</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-foreground bg-background px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                    {getQRCodeUrl(selectedEstablishment.adnguard_code || "")}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(getQRCodeUrl(selectedEstablishment.adnguard_code || ""));
                      toast.success("Lien copié !");
                    }}
                  >
                    Copier
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Scannez ce QR code pour vérifier la certification de cet établissement.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Modifier le statut</DialogTitle>
          </DialogHeader>
          {selectedEstablishment && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Établissement: <strong>{selectedEstablishment.name}</strong>
              </p>
              <p className="text-sm">Statut actuel: {getStatusBadge(selectedEstablishment.status)}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="border-primary text-primary"
                  onClick={() => handleUpdateStatus(selectedEstablishment, "conforme")}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Conforme
                </Button>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive"
                  onClick={() => handleUpdateStatus(selectedEstablishment, "non_conforme")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Non conforme
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedEstablishment, "en_attente")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  En attente
                </Button>
                <Button
                  variant="outline"
                  className="text-muted-foreground"
                  onClick={() => handleUpdateStatus(selectedEstablishment, "suspendu")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Suspendu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
