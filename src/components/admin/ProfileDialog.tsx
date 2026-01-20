import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { UserCog, Key, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const ProfileDialog = () => {
    const { user, updatePassword } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await updatePassword(currentPassword, newPassword);
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Mot de passe mis à jour avec succès");
                setIsOpen(false);
                // Reset form
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            toast.error("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="shrink-0" title="Profil">
                    <UserCog className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCog className="w-5 h-5 text-primary" />
                        Mon Profil
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* User Info Read-only */}
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{user?.email}</span>
                        </div>
                        {user?.profile?.full_name && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground ml-6">Nom:</span>
                                <span className="font-medium">{user.profile.full_name}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Modifier le mot de passe
                        </h3>

                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="hero"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
