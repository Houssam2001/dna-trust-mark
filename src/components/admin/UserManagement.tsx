import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, UserPlus, Shield, UserCog, Trash2 } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";
import { AppRole } from "@/types";

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: AppRole[];
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole | "">("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<UserWithRoles[]>("/admin/users");
      setUsers(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      await api.post(`/admin/users/${selectedUser.id}/roles`, { role: selectedRole });

      toast.success(`Rôle ${selectedRole} ajouté avec succès`);
      setIsRoleDialogOpen(false);
      setSelectedRole("");
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding role:", error);
      if (error.response?.status === 409) {
        toast.error("Cet utilisateur a déjà ce rôle");
      } else {
        toast.error("Erreur lors de l'ajout du rôle: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    if (!confirm(`Êtes-vous sûr de vouloir retirer le rôle ${role} ?`)) return;

    try {
      await api.delete(`/admin/users/${userId}/roles/${role}`);

      toast.success(`Rôle ${role} retiré avec succès`);
      fetchUsers();
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast.error("Erreur lors du retrait du rôle: " + (error.response?.data?.message || error.message));
    }
  };

  const getRoleBadge = (role: AppRole) => {
    const variants: Record<AppRole, { class: string; label: string }> = {
      admin: { class: "bg-destructive/10 text-destructive border-destructive/20", label: "Admin" },
      agent: { class: "bg-primary/10 text-primary border-primary/20", label: "Agent" },
      owner: { class: "bg-muted text-muted-foreground border-border", label: "Propriétaire" },
    };
    const variant = variants[role] || { class: "bg-gray-100 text-gray-500", label: role };
    return (
      <Badge variant="outline" className={variant.class}>
        {variant.label}
      </Badge>
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const availableRoles: AppRole[] = ["admin", "agent", "owner"];
  const rolesNotAssigned = selectedUser
    ? availableRoles.filter((r) => !selectedUser.roles.includes(r))
    : availableRoles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <UserCog className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôles</TableHead>
                <TableHead>Inscrit le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <div key={role} className="flex items-center gap-1">
                            {getRoleBadge(role)}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveRole(user.id, role)}
                              title="Retirer ce rôle"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucun rôle</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setSelectedRole("");
                        setIsRoleDialogOpen(true);
                      }}
                      disabled={user.roles.length >= availableRoles.length}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Ajouter un rôle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Ajouter un rôle
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Utilisateur : <span className="font-medium text-foreground">{selectedUser?.full_name || selectedUser?.email}</span>
              </p>
            </div>
            {rolesNotAssigned.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Cet utilisateur a déjà tous les rôles disponibles.
              </p>
            ) : (
              <>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesNotAssigned.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role === "admin" && "Admin - Accès complet"}
                        {role === "agent" && "Agent - Peut effectuer des contrôles"}
                        {role === "owner" && "Propriétaire - Accès à ses établissements"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddRole}
                  disabled={!selectedRole}
                  className="w-full"
                  variant="hero"
                >
                  Confirmer
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
