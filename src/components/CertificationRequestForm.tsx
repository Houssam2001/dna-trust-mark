import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Shield, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import api from "@/services/api";
import { useTranslation } from "react-i18next";

import { EstablishmentType } from "@/types";

interface CertificationRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CertificationRequestForm = ({ open, onOpenChange }: CertificationRequestFormProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    type: "boucherie" as EstablishmentType,
    address: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
    email: "",
    siret: "",
    message: "",
  });

  const requestSchema = z.object({
    name: z.string().trim().min(2, t('form.validation.nameMin')).max(100),
    type: z.enum(["boucherie", "restaurant", "usine", "traiteur", "autre"]),
    address: z.string().trim().min(5, t('form.validation.addressRequired')).max(200),
    city: z.string().trim().min(2, t('form.validation.cityRequired')).max(100),
    postal_code: z.string().trim().max(10).optional(),
    country: z.string().trim().min(2).max(50).optional(),
    phone: z.string().trim().max(20).optional(),
    email: z.string().trim().email(t('form.validation.emailInvalid')).max(255),
    siret: z.string().trim().max(20).optional(),
    message: z.string().trim().max(500).optional(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = requestSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post("/establishments/request", form);

      setSuccess(true);
      toast.success(t('form.success.toast'));
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast.error(t('form.error.toast') + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after animation
    setTimeout(() => {
      setSuccess(false);
      setForm({
        name: "",
        type: "boucherie",
        address: "",
        city: "",
        postal_code: "",
        country: "",
        phone: "",
        email: "",
        siret: "",
        message: "",
      });
      setErrors({});
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">{t('form.success.title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('form.success.desc')}
            </p>
            <Button variant="hero" onClick={handleClose}>
              {t('common.close')}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <DialogTitle className="text-xl">{t('form.title')}</DialogTitle>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>{t('form.fields.name')} *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('form.placeholders.name')}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{t('form.fields.type')} *</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v: EstablishmentType) => setForm({ ...form, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boucherie">{t('types.boucherie')}</SelectItem>
                      <SelectItem value="restaurant">{t('types.restaurant')}</SelectItem>
                      <SelectItem value="usine">{t('types.usine')}</SelectItem>
                      <SelectItem value="traiteur">{t('types.traiteur')}</SelectItem>
                      <SelectItem value="produits_laitiers">{t('types.produits_laitiers')}</SelectItem>
                      <SelectItem value="produits_de_la_mer">{t('types.produits_de_la_mer')}</SelectItem>
                      <SelectItem value="epiceries">{t('types.epiceries')}</SelectItem>
                      <SelectItem value="boulangeries">{t('types.boulangeries')}</SelectItem>
                      <SelectItem value="pharmacies">{t('types.pharmacies')}</SelectItem>
                      <SelectItem value="autre">{t('types.autre')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('form.fields.siret')}</Label>
                  <Input
                    value={form.siret}
                    onChange={(e) => setForm({ ...form, siret: e.target.value })}
                    placeholder="123 456 789 00012"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>{t('form.fields.address')} *</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder={t('form.placeholders.address')}
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{t('form.fields.city')} *</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder={t('form.placeholders.city')}
                    className={errors.city ? "border-destructive" : ""}
                  />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{t('form.fields.postalCode')}</Label>
                  <Input
                    value={form.postal_code}
                    onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                    placeholder="75001"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('form.fields.country')}</Label>
                  <Input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder={t('form.placeholders.country')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('form.fields.phone')}</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01 23 45 67 89"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('form.fields.email')} *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@boucherie.fr"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>{t('form.fields.message')}</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t('form.placeholders.message')}
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('form.loading')}
                  </>
                ) : (
                  t('form.submit')
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {t('form.disclaimer')}
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CertificationRequestForm;
