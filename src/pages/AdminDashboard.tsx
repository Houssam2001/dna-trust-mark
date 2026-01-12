import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import type { Database } from "@/integrations/supabase/types";

type Establishment = Database["public"]["Tables"]["establishments"]["Row"];
type Control = Database["public"]["Tables"]["controls"]["Row"];
type EstablishmentType = Database["public"]["Enums"]["establishment_type"];
type CertificationStatus = Database["public"]["Enums"]["certification_status"];

const AdminDashboard = () => {
  const { user, isAdmin, isAgent, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"establishments" | "controls" | "users">("establishments");
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [controls, setControls] = useState<(Control & { establishment_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [isEstablishmentDialogOpen, setIsEstablishmentDialogOpen] = useState(false);
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
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

  const filteredEstablishments = establishments.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.adnguard_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "establishments" ? "hero" : "outline"}
            onClick={() => setActiveTab("establishments")}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Établissements
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
        </div>

        {/* Content */}
        {activeTab === "establishments" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, code ou ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
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
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedEstablishment(establishment);
                                  setIsQRDialogOpen(true);
                                }}
                              >
                                <QrCode className="w-4 h-4" />
                              </Button>
                              <Link to={`/verification?code=${establishment.adnguard_code}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteEstablishment(establishment.id)}
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
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold mb-2">Gestion des Utilisateurs</h2>
            <p className="text-muted-foreground">
              Cette fonctionnalité sera disponible prochainement.
            </p>
          </div>
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
              <p className="text-xs text-muted-foreground">
                Scannez ce QR code pour vérifier la certification de cet établissement.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
