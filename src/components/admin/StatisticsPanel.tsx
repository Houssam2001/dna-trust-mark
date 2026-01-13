import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  CheckCircle2,
  FlaskConical,
  QrCode,
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import type { Database } from "@/integrations/supabase/types";

type CertificationStatus = Database["public"]["Enums"]["certification_status"];

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
    
    // Subscribe to realtime updates for qr_verifications
    const channel = supabase
      .channel("stats-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "qr_verifications" },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all establishments
      const { data: establishments, error: estError } = await supabase
        .from("establishments")
        .select("id, status, created_at");

      if (estError) throw estError;

      // Fetch all controls
      const { data: controls, error: ctrlError } = await supabase
        .from("controls")
        .select("id, control_date, result");

      if (ctrlError) throw ctrlError;

      // Fetch QR verifications
      const { data: qrVerifications, error: qrError } = await supabase
        .from("qr_verifications")
        .select("id, verified_at");

      if (qrError) throw qrError;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Calculate stats
      const totalEstablishments = establishments?.length || 0;
      const certifiedEstablishments = establishments?.filter(
        (e) => e.status === "conforme"
      ).length || 0;

      const totalControls = controls?.length || 0;
      const monthlyControls = controls?.filter(
        (c) => new Date(c.control_date) >= startOfMonth
      ).length || 0;

      const conformeControls = controls?.filter((c) => c.result === "conforme").length || 0;
      const complianceRate = totalControls > 0 
        ? Math.round((conformeControls / totalControls) * 100) 
        : 0;

      const qrTotal = qrVerifications?.length || 0;
      const monthlyQrVerifications = qrVerifications?.filter(
        (v) => new Date(v.verified_at) >= startOfMonth
      ).length || 0;

      // Status distribution
      const statusCounts: Record<CertificationStatus, number> = {
        conforme: 0,
        non_conforme: 0,
        en_attente: 0,
        suspendu: 0,
      };

      establishments?.forEach((e) => {
        if (e.status in statusCounts) {
          statusCounts[e.status as CertificationStatus]++;
        }
      });

      const statusDistribution = [
        { name: "Conformes", value: statusCounts.conforme, color: "hsl(152, 69%, 31%)" },
        { name: "Non conformes", value: statusCounts.non_conforme, color: "hsl(0, 84%, 60%)" },
        { name: "En attente", value: statusCounts.en_attente, color: "hsl(43, 96%, 56%)" },
        { name: "Suspendus", value: statusCounts.suspendu, color: "hsl(210, 20%, 45%)" },
      ];

      // Controls by month (last 6 months)
      const controlsByMonth: { month: string; controls: number; conformes: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const monthName = date.toLocaleDateString("fr-FR", { month: "short" });

        const monthControls = controls?.filter((c) => {
          const d = new Date(c.control_date);
          return d >= date && d <= monthEnd;
        }) || [];

        controlsByMonth.push({
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          controls: monthControls.length,
          conformes: monthControls.filter((c) => c.result === "conforme").length,
        });
      }

      // QR verifications by month (last 6 months)
      const qrByMonth: { month: string; verifications: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const monthName = date.toLocaleDateString("fr-FR", { month: "short" });

        const monthVerifications = qrVerifications?.filter((v) => {
          const d = new Date(v.verified_at);
          return d >= date && d <= monthEnd;
        }) || [];

        qrByMonth.push({
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          verifications: monthVerifications.length,
        });
      }

      setStats({
        totalEstablishments,
        certifiedEstablishments,
        totalControls,
        monthlyControls,
        complianceRate,
        qrVerifications: qrTotal,
        monthlyQrVerifications,
        statusDistribution,
        controlsByMonth,
        qrByMonth,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
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
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                {trend === "up" && <TrendingUp className="w-3 h-3 text-primary" />}
                {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
                {subtitle}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Répartition des statuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
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
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {stats.statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
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
