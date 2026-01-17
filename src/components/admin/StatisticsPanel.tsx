import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CheckCircle2,
  FlaskConical,
  QrCode,
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import api from "@/services/api";

interface StatsData {
  totalEstablishments: number;
  certifiedEstablishments: number;
  totalControls: number;
  monthlyControls: number;
  complianceRate: number;
  qrVerifications: number;
  monthlyQrVerifications: number;
  statusDistribution: { name: string; value: number; color: string }[];
  controlsByMonth: { month: string; controls: number; conformes: number }[];
  qrByMonth: { month: string; verifications: number }[];
}

const StatisticsPanel = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get<StatsData>("/admin/stats");
      setStats(response.data);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      toast.error("Erreur lors du chargement des statistiques: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!stats) return;

    try {
      const doc = new jsPDF();
      const now = new Date();
      const dateStr = now.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Header
      doc.setFontSize(20);
      doc.setTextColor(23, 37, 84); // Dark blue
      doc.text("ADNGUARD - Rapport Statistiques", 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Généré le ${dateStr}`, 20, 35);

      // KPIs Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Indicateurs Clés de Performance", 20, 50);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const kpis = [
        `• Établissements labellisés: ${stats.certifiedEstablishments} sur ${stats.totalEstablishments}`,
        `• Contrôles ce mois: ${stats.monthlyControls} (${stats.totalControls} total)`,
        `• Taux de conformité: ${stats.complianceRate}%`,
        `• Visites QR code: ${stats.qrVerifications} (${stats.monthlyQrVerifications} ce mois)`,
      ];
      kpis.forEach((kpi, i) => {
        doc.text(kpi, 25, 60 + i * 8);
      });

      // Status Distribution
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Répartition des Statuts", 20, 100);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      stats.statusDistribution.forEach((status, i) => {
        doc.text(`• ${status.name}: ${status.value} établissements`, 25, 110 + i * 8);
      });

      // Controls by Month
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Contrôles par Mois (6 derniers mois)", 20, 150);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      stats.controlsByMonth.forEach((month, i) => {
        doc.text(
          `• ${month.month}: ${month.controls} contrôles (${month.conformes} conformes)`,
          25,
          160 + i * 8
        );
      });

      // QR Verifications by Month
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Visites QR Code par Mois", 20, 215);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      stats.qrByMonth.forEach((month, i) => {
        doc.text(`• ${month.month}: ${month.verifications} vérifications`, 25, 225 + i * 8);
      });

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("© ADNGUARD - Certification ADN Halal", 20, 280);

      doc.save(`adnguard-rapport-${now.toISOString().split("T")[0]}.pdf`);
      toast.success("Rapport PDF téléchargé !");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  const exportToExcel = () => {
    if (!stats) return;

    try {
      const now = new Date();

      // Create workbook
      const wb = XLSX.utils.book_new();

      // KPIs Sheet
      const kpisData = [
        ["Indicateur", "Valeur"],
        ["Établissements labellisés", stats.certifiedEstablishments],
        ["Total établissements", stats.totalEstablishments],
        ["Contrôles ce mois", stats.monthlyControls],
        ["Total contrôles", stats.totalControls],
        ["Taux de conformité (%)", stats.complianceRate],
        ["Visites QR code total", stats.qrVerifications],
        ["Visites QR code ce mois", stats.monthlyQrVerifications],
      ];
      const wsKpis = XLSX.utils.aoa_to_sheet(kpisData);
      XLSX.utils.book_append_sheet(wb, wsKpis, "KPIs");

      // Status Distribution Sheet
      const statusData = [
        ["Statut", "Nombre d'établissements"],
        ...stats.statusDistribution.map((s) => [s.name, s.value]),
      ];
      const wsStatus = XLSX.utils.aoa_to_sheet(statusData);
      XLSX.utils.book_append_sheet(wb, wsStatus, "Répartition Statuts");

      // Controls by Month Sheet
      const controlsData = [
        ["Mois", "Total Contrôles", "Conformes"],
        ...stats.controlsByMonth.map((m) => [m.month, m.controls, m.conformes]),
      ];
      const wsControls = XLSX.utils.aoa_to_sheet(controlsData);
      XLSX.utils.book_append_sheet(wb, wsControls, "Contrôles par Mois");

      // QR Verifications by Month Sheet
      const qrData = [
        ["Mois", "Vérifications"],
        ...stats.qrByMonth.map((m) => [m.month, m.verifications]),
      ];
      const wsQr = XLSX.utils.aoa_to_sheet(qrData);
      XLSX.utils.book_append_sheet(wb, wsQr, "Visites QR par Mois");

      // Save file
      XLSX.writeFile(wb, `adnguard-rapport-${now.toISOString().split("T")[0]}.xlsx`);
      toast.success("Rapport Excel téléchargé !");
    } catch (error) {
      console.error("Error generating Excel:", error);
      toast.error("Erreur lors de la génération du fichier Excel");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Impossible de charger les statistiques
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    subtitle,
    trend,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    subtitle?: string;
    trend?: "up" | "down" | "neutral";
  }) => (
    <Card className="bg-gradient-card border-border hover:shadow-card-hover transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1">
                {trend === "up" && <TrendingUp className="w-3 h-3 text-primary shrink-0" />}
                {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive shrink-0" />}
                <span className="truncate">{subtitle}</span>
              </p>
            )}
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
        <Button variant="outline" onClick={exportToPDF} className="text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          <span className="hidden xs:inline">Exporter</span> PDF
        </Button>
        <Button variant="outline" onClick={exportToExcel} className="text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
          <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          <span className="hidden xs:inline">Exporter</span> Excel
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Établissements labellisés"
          value={stats.certifiedEstablishments}
          icon={CheckCircle2}
          subtitle={`sur ${stats.totalEstablishments} total`}
        />
        <StatCard
          title="Contrôles ce mois"
          value={stats.monthlyControls}
          icon={FlaskConical}
          subtitle={`${stats.totalControls} total`}
          trend="up"
        />
        <StatCard
          title="Taux de conformité"
          value={`${stats.complianceRate}%`}
          icon={Percent}
          subtitle={stats.complianceRate >= 80 ? "Excellent" : "À améliorer"}
          trend={stats.complianceRate >= 80 ? "up" : "down"}
        />
        <StatCard
          title="Visites QR code"
          value={stats.qrVerifications}
          icon={QrCode}
          subtitle={`${stats.monthlyQrVerifications} ce mois`}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="border-border">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-serif flex items-center gap-2">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Répartition des statuts
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[220px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={typeof window !== 'undefined' && window.innerWidth < 640 ? 70 : 100}
                    label={({ name, percent }) =>
                      percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                    }
                    labelLine={false}
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} établissements`, ""]}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
              {stats.statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls by Month Bar Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Contrôles par mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.controlsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="controls"
                    name="Total contrôles"
                    fill="hsl(210, 60%, 20%)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="conformes"
                    name="Conformes"
                    fill="hsl(152, 69%, 31%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Verifications Line Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            Visites QR code par mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.qrByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="verifications"
                  name="Vérifications"
                  stroke="hsl(43, 96%, 56%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(43, 96%, 56%)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;
