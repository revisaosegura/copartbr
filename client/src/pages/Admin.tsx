import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserGrowthChart } from "@/components/analytics/UserGrowthChart";
import { MostViewedVehicles } from "@/components/analytics/MostViewedVehicles";
import { BidStatistics } from "@/components/analytics/BidStatistics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarChart3, Car, Eye, Users, Activity, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const syncMutation = trpc.admin.sync.syncNow.useMutation();
  const utils = trpc.useUtils();

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncMutation.mutateAsync();
      if (result.success) {
        toast.success(`Sincronização concluída! ${result.vehiclesAdded} adicionados, ${result.vehiclesUpdated} atualizados`);
        // Atualizar dados
        utils.admin.vehicles.list.invalidate();
        utils.admin.stats.invalidate();
        utils.admin.sync.getLogs.invalidate();
      } else {
        toast.error(`Erro na sincronização: ${result.error}`);
      }
    } catch (error) {
      toast.error('Erro ao executar sincronização');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={syncing}
      className="bg-[#003087] hover:bg-[#002366]"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
    </Button>
  );
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  // Check if user is admin
  if (!loading && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
              <p className="text-gray-600 mb-4">
                Você não tem permissão para acessar o painel administrativo.
              </p>
              <Button onClick={() => setLocation("/")}>Voltar para Home</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery();
  const { data: syncLogs, isLoading: logsLoading } = trpc.admin.sync.getLogs.useQuery({ limit: 10 });
  const { data: vehicles, isLoading: vehiclesLoading } = trpc.admin.vehicles.list.useQuery();
  const { data: usersData, isLoading: usersLoading } = trpc.admin.users.list.useQuery();
  const { data: recentBids, isLoading: bidsLoading } = trpc.admin.bids.list.useQuery({ limit: 25 });
  
  // Analytics data
  const { data: userGrowth, isLoading: userGrowthLoading } = trpc.admin.analytics.userGrowth.useQuery({ days: 30 });
  const { data: mostViewed, isLoading: mostViewedLoading } = trpc.admin.analytics.mostViewedVehicles.useQuery({ limit: 10 });
  const { data: bidStats, isLoading: bidStatsLoading } = trpc.admin.analytics.bidStatistics.useQuery();

  const formatCurrency = (value: number | null | undefined) =>
    `R$ ${((value ?? 0) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const formatDateTime = (value: string | Date | null | undefined) => {
    if (!value) return "-";
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const getBidStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "outbid":
        return "Superado";
      case "won":
        return "Vencedor";
      case "lost":
        return "Perdido";
      default:
        return status ?? "Desconhecido";
    }
  };

  const getBidStatusClass = (status: string | null | undefined) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "won":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "outbid":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "lost":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando painel...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#003087] mb-2">Painel Administrativo</h1>
              <p className="text-gray-600">Bem-vindo, {user?.name || "Administrador"}</p>
            </div>
            <SyncButton />
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalVehicles || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeVehicles || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Destaque</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.featuredVehicles || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações Hoje</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.todayViews || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitantes Hoje</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.todayVisitors || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Cadastrados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersData?.length || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sync Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Logs de Sincronização</CardTitle>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <p className="text-gray-500">Carregando logs...</p>
                ) : syncLogs && syncLogs.length > 0 ? (
                  <div className="space-y-3">
                    {syncLogs.map((log) => (
                      <div key={log.id} className="border-l-4 border-[#003087] pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-sm">{log.type}</p>
                            <p className="text-sm text-gray-600">{log.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDateTime(log.createdAt)}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              log.status === "success"
                                ? "bg-green-100 text-green-800"
                                : log.status === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum log disponível</p>
                )}
              </CardContent>
            </Card>

            {/* Registered Users */}
            <Card>
              <CardHeader>
                <CardTitle>Usuários Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <p className="text-gray-500">Carregando usuários...</p>
                ) : usersData && usersData.length > 0 ? (
                  <ScrollArea className="max-h-80">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead className="text-right">Registrado em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersData.slice(0, 12).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-semibold text-sm">
                              {user.name || "Nome não informado"}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {user.email || "—"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  user.role === "admin"
                                    ? "bg-red-100 text-red-700 border-transparent"
                                    : "bg-blue-100 text-blue-700 border-transparent"
                                }
                              >
                                {user.role || "user"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-gray-500">
                              {formatDateTime(user.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <p className="text-gray-500">Nenhum usuário cadastrado</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle>Veículos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {vehiclesLoading ? (
                  <p className="text-gray-500">Carregando veículos...</p>
                ) : vehicles && vehicles.length > 0 ? (
                  <div className="space-y-3">
                    {vehicles.slice(0, 5).map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-semibold text-sm">{vehicle.title}</p>
                          <p className="text-xs text-gray-500">Lote: {vehicle.lotNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-[#003087]">
                            {formatCurrency(vehicle.currentBid)}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              vehicle.featured ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {vehicle.featured ? "Destaque" : "Normal"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                    <p className="text-gray-500">Nenhum veículo cadastrado</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lances Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {bidsLoading ? (
                  <p className="text-gray-500">Carregando lances...</p>
                ) : recentBids && recentBids.length > 0 ? (
                  <ScrollArea className="max-h-80">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Participante</TableHead>
                          <TableHead>Veículo</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentBids.map((bid) => (
                          <TableRow key={bid.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">
                                  {bid.userName || `Usuário #${bid.userId}`}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {bid.userEmail || "—"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">
                                  {bid.vehicleTitle || `Veículo #${bid.vehicleId}`}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {bid.vehicleLotNumber ? `Lote: ${bid.vehicleLotNumber}` : ""}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(bid.amount)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getBidStatusClass(bid.status)}>
                                {getBidStatusLabel(bid.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-gray-500">
                              {formatDateTime(bid.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <p className="text-gray-500">Nenhum lance registrado</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="mt-8 space-y-8">
            <h2 className="text-2xl font-bold text-[#003087]">Analytics e Estatísticas</h2>
            
            {/* User Growth Chart */}
            <UserGrowthChart data={userGrowth || []} isLoading={userGrowthLoading} />
            
            {/* Bid Statistics */}
            <BidStatistics data={bidStats || null} isLoading={bidStatsLoading} />
            
            {/* Most Viewed Vehicles */}
            <MostViewedVehicles data={mostViewed || []} isLoading={mostViewedLoading} />
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-[#003087] hover:bg-[#002366]">
                    Adicionar Veículo
                  </Button>
                  <Button variant="outline">
                    Gerenciar Configurações
                  </Button>
                  <Button variant="outline">
                    Ver Relatórios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
