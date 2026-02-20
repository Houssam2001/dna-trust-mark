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
  Calendar,
  ArrowUpDown,
  Pencil,
  Bell,
  AlertTriangle,
  Mail
} from "lucide-react";
import StatisticsPanel from "@/components/admin/StatisticsPanel";
import UserManagement from "@/components/admin/UserManagement";
import { ProfileDialog } from "@/components/admin/ProfileDialog";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { generateCertificatePDF } from "@/lib/generateCertificatePDF";
import { Establishment, Control, CertificationStatus, EstablishmentType } from "@/types";

const AdminDashboard = () => {
  const { user, isAdmin, isAgent, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"establishments" | "controls" | "users" | "stats" | "notifications">("establishments");
  const [statusFilter, setStatusFilter] = useState<"all" | CertificationStatus>("all");
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [controls, setControls] = useState<(Control & { establishmentName?: string })[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]); // Using any for now to match backend response flexibility
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Dialog states
  const [isEstablishmentDialogOpen, setIsEstablishmentDialogOpen] = useState(false);
  const [isEditEstablishmentDialogOpen, setIsEditEstablishmentDialogOpen] = useState(false);
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);

  // Form states - keys updated to match backend expectation (camelCase)
  const [establishmentForm, setEstablishmentForm] = useState({
    name: "",
    type: "boucherie" as EstablishmentType,
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    siret: "",
  });

  const [editEstablishmentForm, setEditEstablishmentForm] = useState({
    id: "",
    name: "",
    type: "boucherie" as EstablishmentType,
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    siret: "",
  });

  const [controlForm, setControlForm] = useState({
    establishmentId: "",
    result: "en_attente" as CertificationStatus,
    speciesAnalyzed: "",
    speciesDetected: "",
    anomaliesDetected: "",
    notes: "",
  });

  const calculateDaysRemaining = (validUntil: string) => {
    const validUntilDate = new Date(validUntil);
    const today = new Date();
    const timeDiff = validUntilDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getNotifications = () => {
    return establishments.filter(est => {
      // Find active certification
      const cert = certifications.find(c => c.establishmentId === est.id && c.isActive);
      if (!cert) {
        // Fallback to establishment validUntil if available
        if ((est as any).validUntil) {
          const daysRemaining = calculateDaysRemaining((est as any).validUntil);
          return daysRemaining <= 60 && daysRemaining > 0;
        }
        return false;
      }
      const daysRemaining = calculateDaysRemaining(cert.validUntil);
      // Simplify logic: Notify if within last 2 months (60 days) and not expired
      return daysRemaining <= 60 && daysRemaining > 0;
    });
  };

  const notifications = getNotifications();

  const handleRemind = async (establishment: Establishment) => {
    try {
      await api.post(`/establishments/${establishment.id}/notify`);
      toast.success(`Rappel envoyé à ${establishment.name}`);
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast.error("Erreur lors de l'envoi du rappel: " + (error.response?.data?.message || error.message));

      // Fallback: Open mail client
      if (establishment.email) {
        window.open(`mailto:${establishment.email}?subject=Rappel%20Renouvellement%20Certification%20ADN-Guard&body=Bonjour%20${establishment.name},%0D%0A%0D%0AVotre%20certification%20arrive%20bient%C3%B4t%20%C3%A0%20%C3%A9ch%C3%A9ance.%20Merci%20de%20pr%C3%A9voir%20son%20renouvellement.%0D%0A%0D%0ACordialement,%0D%0AL'%C3%A9quipe%20ADN-Guard`);
      }
    }
  };

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
      if (activeTab === "establishments" || activeTab === "notifications") {
        const [estResponse, certResponse] = await Promise.all([
          api.get<Establishment[]>("/establishments"),
          api.get<any[]>("/certifications"),
        ]);
        setEstablishments(estResponse.data);
        setCertifications(certResponse.data);
      } else if (activeTab === "controls") {
        const response = await api.get<Control[]>("/controls");
        // Map backend response which includes 'establishment' object
        const mappedControls = response.data.map((c) => ({
          ...c,
          establishmentName: c.establishment?.name || "Unknown",
        }));
        setControls(mappedControls);
      }
    } catch (error: any) {
      toast.error("Erreur lors du chargement des données: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEstablishment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/establishments", establishmentForm);

      toast.success("Établissement créé avec succès !");
      setIsEstablishmentDialogOpen(false);
      setEstablishmentForm({
        name: "",
        type: "boucherie",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
        email: "",
        siret: "",
      });
      fetchData();
    } catch (error: any) {
      toast.error("Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const getCertificationDetails = (establishmentId: string) => {
    const cert = certifications.find((c) => c.establishmentId === establishmentId && c.isActive);
    if (!cert) return null;

    const validUntilDate = new Date(cert.validUntil);
    const today = new Date();
    const timeDiff = validUntilDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return {
      ...cert,
      daysRemaining,
      validFromDate: new Date(cert.validFrom),
      validUntilDate: validUntilDate,
    };
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openEditDialog = (establishment: Establishment) => {
    setEditEstablishmentForm({
      id: establishment.id,
      name: establishment.name,
      type: establishment.type,
      address: establishment.address,
      city: establishment.city,
      postalCode: establishment.postalCode || "",
      phone: establishment.phone || "",
      email: establishment.email || "",
      siret: establishment.siret || "",
    });
    setIsEditEstablishmentDialogOpen(true);
  };

  const handleEditEstablishment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...data } = editEstablishmentForm;
      await api.put(`/establishments/${id}`, data);

      toast.success("Informations modifiées avec succès !");
      setIsEditEstablishmentDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateControl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        establishmentId: controlForm.establishmentId,
        result: controlForm.result,
        speciesAnalyzed: controlForm.speciesAnalyzed.split(",").map((s) => s.trim()).filter(Boolean),
        speciesDetected: controlForm.speciesDetected.split(",").map((s) => s.trim()).filter(Boolean),
        anomaliesDetected: controlForm.anomaliesDetected || undefined,
        notes: controlForm.notes || undefined,
      };

      await api.post("/controls", payload);

      toast.success("Contrôle enregistré avec succès !");
      setIsControlDialogOpen(false);
      setControlForm({
        establishmentId: "",
        result: "en_attente",
        speciesAnalyzed: "",
        speciesDetected: "",
        anomaliesDetected: "",
        notes: "",
      });
      fetchData();
    } catch (error: any) {
      toast.error("Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteEstablishment = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) return;

    try {
      await api.delete(`/establishments/${id}`);
      toast.success("Établissement supprimé");
      fetchData();
    } catch (error: any) {
      toast.error("Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateStatus = async (establishment: Establishment, newStatus: CertificationStatus) => {
    try {
      // The backend handles certification creation if status becomes 'conforme'
      await api.put(`/establishments/${establishment.id}`, { status: newStatus });

      toast.success(`Statut mis à jour: ${newStatus}`);
      setIsStatusDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("Erreur: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDownloadCertificate = async (establishment: Establishment) => {
    try {
      // Fetch all certifications and filter for this establishment
      // Ideal world: GET /certifications?establishmentId=...
      // Current world: GET /certifications and find
      const response = await api.get<any[]>("/certifications"); // Using any temporarily as imported type might differ slightly from backend response if not careful
      const certData = response.data.find(c => c.establishmentId === establishment.id && c.isActive);

      if (!certData) {
        toast.error("Aucune certification active trouvée pour cet établissement.");
        return;
      }

      // Create a temporary canvas to get QR code as data URL
      const canvas = document.createElement("canvas");
      const qrUrl = `${window.location.origin}/verification?code=${establishment.adnguardCode}`;

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
        adnguardCode: establishment.adnguardCode || "",
        address: establishment.address,
        city: establishment.city,
        certifiedSince: establishment.certifiedSince
          ? new Date(establishment.certifiedSince).toLocaleDateString("fr-FR")
          : undefined,
        validFrom: certData.validFrom
          ? new Date(certData.validFrom).toLocaleDateString("fr-FR")
          : new Date().toLocaleDateString("fr-FR"),
        validUntil: certData.validUntil
          ? new Date(certData.validUntil).toLocaleDateString("fr-FR")
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
        qrCodeDataUrl: qrDataUrl,
      });

      toast.success("Certificat PDF généré !");
    } catch (error: any) {
      toast.error("Erreur lors de la génération du certificat: " + error.message);
    }
  };

  const getStatusBadge = (status: CertificationStatus) => {
    const configs = {
      conforme: { icon: CheckCircle2, label: "Conforme", className: "bg-primary/10 text-primary" },
      non_conforme: { icon: XCircle, label: "Non conforme", className: "bg-destructive/10 text-destructive" },
      en_attente: { icon: Clock, label: "En attente", className: "bg-accent/10 text-accent-foreground" },
      suspendu: { icon: XCircle, label: "Suspendu", className: "bg-muted text-muted-foreground" },
      n_existe_plus: { icon: XCircle, label: "N'existe plus", className: "bg-gray-200 text-gray-500" },
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
      e.adnguardCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (!sortConfig) return 0;

    if (sortConfig.key === "daysRemaining") {
      const detailsA = getCertificationDetails(a.id);
      const detailsB = getCertificationDetails(b.id);

      const daysA = detailsA ? detailsA.daysRemaining : -Infinity;
      const daysB = detailsB ? detailsB.daysRemaining : -Infinity;

      if (daysA === daysB) return 0;

      const comparison = daysA < daysB ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    return 0;
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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <span className="text-lg sm:text-xl font-serif font-bold hidden xs:inline">
              ADN<span className="text-primary">GUARD</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground hidden lg:block truncate max-w-[200px]">
              {user?.email}
            </span>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium shrink-0">
              {isAdmin ? "Admin" : "Agent"}
            </span>
            <ProfileDialog />
            <Button variant="ghost" size="sm" onClick={signOut} className="shrink-0" title="Déconnexion">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "establishments" ? "hero" : "outline"}
            onClick={() => setActiveTab("establishments")}
            className="relative text-xs sm:text-sm px-3 sm:px-4 shrink-0"
            size="sm"
          >
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Établissements</span>
            <span className="xs:hidden">Établ.</span>
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-destructive text-destructive-foreground text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === "controls" ? "hero" : "outline"}
            onClick={() => setActiveTab("controls")}
            className="text-xs sm:text-sm px-3 sm:px-4 shrink-0"
            size="sm"
          >
            <FlaskConical className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Contrôles ADN</span>
            <span className="xs:hidden">Contrôles</span>
          </Button>
          {isAdmin && (
            <Button
              variant={activeTab === "users" ? "hero" : "outline"}
              onClick={() => setActiveTab("users")}
              className="text-xs sm:text-sm px-3 sm:px-4 shrink-0"
              size="sm"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Utilisateurs</span>
              <span className="xs:hidden">Users</span>
            </Button>
          )}
          {isAdmin && (
            <Button
              variant={activeTab === "stats" ? "hero" : "outline"}
              onClick={() => setActiveTab("stats")}
              className="text-xs sm:text-sm px-3 sm:px-4 shrink-0"
              size="sm"
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Statistiques</span>
              <span className="xs:hidden">Stats</span>
            </Button>
          )}
          <Button
            variant={activeTab === "notifications" ? "hero" : "outline"}
            onClick={() => setActiveTab("notifications")}
            className="relative text-xs sm:text-sm px-3 sm:px-4 shrink-0"
            size="sm"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Notifications</span>
            <span className="xs:hidden">Notifs</span>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-destructive text-destructive-foreground text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </div>

        {/* Content */}
        {activeTab === "establishments" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 text-sm"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as "all" | CertificationStatus)}
                >
                  <SelectTrigger className="w-full sm:w-[160px] text-sm">
                    <SelectValue placeholder="Filtrer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="conforme">Conforme</SelectItem>
                    <SelectItem value="non_conforme">Non conforme</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                    <SelectItem value="n_existe_plus">N'existe plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isEstablishmentDialogOpen} onOpenChange={setIsEstablishmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="w-full sm:w-auto text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden xs:inline">Nouvel établissement</span>
                    <span className="xs:hidden">Ajouter</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg">Ajouter un établissement</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateEstablishment} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="text-sm">Nom de l'établissement *</Label>
                        <Input
                          value={establishmentForm.name}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, name: e.target.value })
                          }
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Type *</Label>
                        <Select
                          value={establishmentForm.type}
                          onValueChange={(v: EstablishmentType) =>
                            setEstablishmentForm({ ...establishmentForm, type: v })
                          }
                        >
                          <SelectTrigger className="text-sm">
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
                        <Label className="text-sm">SIRET</Label>
                        <Input
                          value={establishmentForm.siret}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, siret: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="text-sm">Adresse *</Label>
                        <Input
                          value={establishmentForm.address}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, address: e.target.value })
                          }
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Ville *</Label>
                        <Input
                          value={establishmentForm.city}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, city: e.target.value })
                          }
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Code postal</Label>
                        <Input
                          value={establishmentForm.postalCode}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, postalCode: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Téléphone</Label>
                        <Input
                          value={establishmentForm.phone}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, phone: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Email</Label>
                        <Input
                          type="email"
                          value={establishmentForm.email}
                          onChange={(e) =>
                            setEstablishmentForm({ ...establishmentForm, email: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="hero" className="w-full text-sm">
                      Créer l'établissement
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditEstablishmentDialogOpen} onOpenChange={setIsEditEstablishmentDialogOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg">Modifier les informations</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditEstablishment} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="text-sm">Nom de l'établissement *</Label>
                        <Input
                          value={editEstablishmentForm.name}
                          onChange={(e) =>
                            setEditEstablishmentForm({ ...editEstablishmentForm, name: e.target.value })
                          }
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Type *</Label>
                        <Select
                          value={editEstablishmentForm.type}
                          onValueChange={(v: EstablishmentType) =>
                            setEditEstablishmentForm({ ...editEstablishmentForm, type: v })
                          }
                        >
                          <SelectTrigger className="text-sm">
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
                        <Label className="text-sm">SIRET</Label>
                        <Input
                          value={editEstablishmentForm.siret}
                          onChange={(e) =>
                            setEditEstablishmentForm({ ...editEstablishmentForm, siret: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="text-sm">Adresse *</Label>
                        <Input
                          value={editEstablishmentForm.address}
                          onChange={(e) =>
                            setEditEstablishmentForm({ ...editEstablishmentForm, address: e.target.value })
                          }
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Ville *</Label>
                        <Input
                          value={editEstablishmentForm.city}
                          onChange={(e) =>
                            setEditEstablishmentForm({ ...editEstablishmentForm, city: e.target.value })
                          }
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Code postal</Label>
                        <Input
                          value={editEstablishmentForm.postalCode}
                          onChange={(e) =>
                            setEditEstablishmentForm({ ...editEstablishmentForm, postalCode: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Téléphone</Label>
                        <Input
                          value={editEstablishmentForm.phone}
                          onChange={(e) =>
                            setEditEstablishmentForm({ ...editEstablishmentForm, phone: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Email</Label>
                        <Input
                          type="email"
                          value={editEstablishmentForm.email}
                          onChange={(e) =>
                            setEditEstablishmentForm({ ...editEstablishmentForm, email: e.target.value })
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="hero" className="w-full text-sm">
                      Enregistrer les modifications
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile Card View + Desktop Table */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block lg:hidden space-y-3">
                  {filteredEstablishments.map((establishment) => {
                    const certDetails = getCertificationDetails(establishment.id);
                    return (
                      <div key={establishment.id} className="bg-card rounded-xl border border-border p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-xs text-primary mb-1">{establishment.adnguardCode}</p>
                            {establishment.status === "conforme" && certDetails && (
                              <div className="mb-3 text-xs bg-muted/40 p-2 rounded-md">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-muted-foreground">Validité:</span>
                                  <span className="font-medium">
                                    {certDetails.validFromDate.toLocaleDateString("fr-FR")} - {certDetails.validUntilDate.toLocaleDateString("fr-FR")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-muted-foreground">Restant:</span>
                                  <span className={`font-medium ${certDetails.daysRemaining < 30 ? "text-destructive" : "text-green-600"}`}>
                                    {certDetails.daysRemaining} jours
                                  </span>
                                </div>
                              </div>
                            )}
                            <h3 className="font-medium text-sm truncate">{establishment.name}</h3>

                            <p className="text-xs text-muted-foreground capitalize">{establishment.type}</p>
                            <p className="text-xs text-muted-foreground truncate" title={`${establishment.address}, ${establishment.city}`}>
                              {establishment.address}, {establishment.city}
                            </p>
                          </div>
                          {getStatusBadge(establishment.status)}
                        </div>

                        <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedEstablishment(establishment);
                                setIsStatusDialogOpen(true);
                              }}
                              className="h-8 px-2 text-xs"
                            >
                              <Edit className="w-3.5 h-3.5 mr-1" />
                              Statut
                            </Button>
                          )}
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(establishment)}
                              className="h-8 px-2 text-xs"
                              title="Modifier infos"
                            >
                              <Pencil className="w-3.5 h-3.5 mr-1" />
                              Infos
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEstablishment(establishment);
                              setIsQRDialogOpen(true);
                            }}
                            className="h-8 px-2 text-xs"
                          >
                            <QrCode className="w-3.5 h-3.5 mr-1" />
                            QR
                          </Button>
                          {establishment.status === "conforme" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadCertificate(establishment)}
                              className="h-8 px-2 text-xs text-primary"
                            >
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              PDF
                            </Button>
                          )}
                          {isAdmin && establishment.status === "en_attente" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(establishment, "conforme")}
                                className="h-8 px-2 text-xs text-primary"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(establishment, "non_conforme")}
                                className="h-8 px-2 text-xs text-destructive"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEstablishment(establishment.id)}
                              className="h-8 px-2 text-xs text-destructive ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredEstablishments.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      Aucun établissement trouvé
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-card rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Code</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Établissement</th>
                          <th
                            className="text-left px-4 py-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                            onClick={() => handleSort("daysRemaining")}
                          >
                            <div className="flex items-center gap-1">
                              Jours restants
                              <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </div>
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Adresse</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Ville</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Validité</th>

                          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Statut</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredEstablishments.map((establishment) => {
                          const certDetails = getCertificationDetails(establishment.id);
                          return (
                            <tr key={establishment.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3 font-mono text-sm text-primary">{establishment.adnguardCode}</td>
                              <td className="px-4 py-3 font-medium">{establishment.name}</td>
                              <td className="px-4 py-3 text-xs text-muted-foreground">
                                {establishment.status === "conforme" && certDetails ? (
                                  <div className="flex flex-col">
                                    <span>Du: {certDetails.validFromDate.toLocaleDateString("fr-FR")}</span>
                                    <span>Au: {certDetails.validUntilDate.toLocaleDateString("fr-FR")}</span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm capitalize">{establishment.type}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[200px]" title={establishment.address}>{establishment.address}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{establishment.city}</td>

                              <td className="px-4 py-3 text-sm">
                                {establishment.status === "conforme" && certDetails ? (
                                  <span className={`font-medium ${certDetails.daysRemaining < 30 ? "text-destructive" : "text-green-600"}`}>
                                    {certDetails.daysRemaining} jours
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="px-4 py-3">{getStatusBadge(establishment.status)}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  {isAdmin && (
                                    <>
                                      <Button variant="ghost" size="icon" onClick={() => { setSelectedEstablishment(establishment); setIsStatusDialogOpen(true); }} title="Modifier le statut">
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(establishment)} title="Modifier les infos">
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                  <Button variant="ghost" size="icon" onClick={() => { setSelectedEstablishment(establishment); setIsQRDialogOpen(true); }} title="Voir le QR Code">
                                    <QrCode className="w-4 h-4" />
                                  </Button>
                                  <Link to={`/verification?code=${establishment.adnguardCode}`}>
                                    <Button variant="ghost" size="icon" title="Voir la page publique">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  {establishment.status === "conforme" && (
                                    <Button variant="ghost" size="icon" onClick={() => handleDownloadCertificate(establishment)} title="Télécharger le certificat PDF">
                                      <FileText className="w-4 h-4 text-primary" />
                                    </Button>
                                  )}
                                  {isAdmin && establishment.status === "en_attente" && (
                                    <>
                                      <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(establishment, "conforme")} title="Accepter" className="text-primary hover:text-primary">
                                        <Check className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(establishment, "non_conforme")} title="Refuser" className="text-destructive hover:text-destructive">
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                  {isAdmin && (
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEstablishment(establishment.id)} title="Supprimer">
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {filteredEstablishments.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      Aucun établissement trouvé
                    </div>
                  )}
                </div>
              </>
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
                        value={controlForm.establishmentId}
                        onValueChange={(v) =>
                          setControlForm({ ...controlForm, establishmentId: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un établissement" />
                        </SelectTrigger>
                        <SelectContent>
                          {establishments.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.adnguardCode} - {e.name}
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
                        value={controlForm.speciesAnalyzed}
                        onChange={(e) =>
                          setControlForm({ ...controlForm, speciesAnalyzed: e.target.value })
                        }
                        placeholder="Bœuf, Agneau, Poulet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Espèces détectées (séparées par des virgules)</Label>
                      <Input
                        value={controlForm.speciesDetected}
                        onChange={(e) =>
                          setControlForm({ ...controlForm, speciesDetected: e.target.value })
                        }
                        placeholder="Bœuf, Agneau"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Anomalies détectées</Label>
                      <Textarea
                        value={controlForm.anomaliesDetected}
                        onChange={(e) =>
                          setControlForm({ ...controlForm, anomaliesDetected: e.target.value })
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
                            {control.reportId}
                          </td>
                          <td className="px-4 py-3 font-medium">{control.establishmentName}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(control.controlDate).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(control.result)}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {control.speciesAnalyzed?.join(", ") || "-"}
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

        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-serif font-bold">Rappels de renouvellement</h2>
                </div>
                <p className="text-muted-foreground">
                  Clients arrivant à échéance de leur certification (moins de 2 mois restants)
                </p>
              </div>
              <div className="p-6">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500/50" />
                    <p>Aucune notification en attente. Tous les certificats sont à jour.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map(est => {
                      const cert = certifications.find(c => c.establishmentId === est.id && c.isActive);
                      const validUntil = cert ? cert.validUntil : (est as any).validUntil;
                      const days = validUntil ? calculateDaysRemaining(validUntil) : 0;

                      const typeLabel: Record<string, string> = {
                        boucherie: "Boucherie",
                        restaurant: "Restaurant",
                        usine: "Usine",
                        traiteur: "Traiteur",
                        autre: "Autre",
                      };

                      return (
                        <div key={est.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-xl border border-border gap-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                              <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{est.name}</h4>
                              <p className="text-sm text-muted-foreground mb-1">
                                {est.city} • {typeLabel[est.type] || est.type}
                              </p>
                              <div className="flex items-center gap-4 text-sm flex-wrap">
                                <span className="text-orange-600 font-medium inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  Expire dans {days} jours
                                </span>
                                <span className="text-muted-foreground">
                                  Validité jusqu'au {validUntil ? new Date(validUntil).toLocaleDateString("fr-FR") : "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button onClick={() => handleRemind(est)} size="sm" className="gap-2 w-full sm:w-auto shrink-0 shadow-sm">
                            <Mail className="w-4 h-4" />
                            Relancer
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="max-w-sm text-center mx-24">
          <DialogHeader>
            <DialogTitle>QR Code de Certification</DialogTitle>
          </DialogHeader>
          {selectedEstablishment && (
            <div className="space-y-4  ">
              <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                <QRCodeSVG
                  value={getQRCodeUrl(selectedEstablishment.adnguardCode || "")}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              <div>
                <p className="font-mono text-lg text-primary font-bold">
                  {selectedEstablishment.adnguardCode}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedEstablishment.name}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Lien de vérification :</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-foreground bg-background px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                    {getQRCodeUrl(selectedEstablishment.adnguardCode || "")}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(getQRCodeUrl(selectedEstablishment.adnguardCode || ""));
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
                <Button
                  variant="outline"
                  className="text-gray-500 border-gray-300"
                  onClick={() => handleUpdateStatus(selectedEstablishment, "n_existe_plus")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  N'existe plus
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default AdminDashboard;
