import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserGrowthChart } from "@/components/analytics/UserGrowthChart";
import { MostViewedVehicles } from "@/components/analytics/MostViewedVehicles";
import { BidStatistics } from "@/components/analytics/BidStatistics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarChart3, Car, Eye, Users, Activity, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { RefreshCw, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

function LogoutButton() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_username");
    toast.success("Logout realizado com sucesso!");
    setLocation("/admin/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="border-red-500 text-red-500 hover:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  );
}

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
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Todos os hooks devem ser chamados no topo (regra dos hooks)
  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(undefined, { enabled: isAuthenticated });
  const { data: syncLogs, isLoading: logsLoading } = trpc.admin.sync.getLogs.useQuery({ limit: 10 }, { enabled: isAuthenticated });
  const { data: vehicles, isLoading: vehiclesLoading } = trpc.admin.vehicles.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: usersData, isLoading: usersLoading } = trpc.admin.users.list.useQuery(undefined, { enabled: isAuthenticated });
  
  // Analytics data
  const { data: userGrowth, isLoading: userGrowthLoading } = trpc.admin.analytics.userGrowth.useQuery({ days: 30 }, { enabled: isAuthenticated });
  const { data: mostViewed, isLoading: mostViewedLoading } = trpc.admin.analytics.mostViewedVehicles.useQuery({ limit: 10 }, { enabled: isAuthenticated });
  const { data: bidStats, isLoading: bidStatsLoading } = trpc.admin.analytics.bidStatistics.useQuery(undefined, { enabled: isAuthenticated });

  // Verificar autenticação no localStorage
  useEffect(() => {
    const authenticated = localStorage.getItem("admin_authenticated") === "true";
    
    if (!authenticated) {
      setLocation("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, [setLocation]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado, não renderizar nada (já foi redirecionado)
  if (!isAuthenticated) {
    return null;
  }

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
              <p className="text-gray-600">Bem-vindo, Administrador</p>
            </div>
            <div className="flex gap-3">
              <LogoutButton />
              <SyncButton />
            </div>
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
                              {new Date(log.createdAt).toLocaleString("pt-BR")}
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
                  <div className="space-y-3">
                    {usersData.slice(0, 10).map((user) => (
                      <div key={user.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-semibold text-sm">{user.name || "Nome não informado"}</p>
                          <p className="text-xs text-gray-500">{user.email || "Email não informado"}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              user.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role || "user"}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                            R$ {(vehicle.currentBid / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
