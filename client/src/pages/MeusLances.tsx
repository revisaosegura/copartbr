import { useEffect, useState } from "react";
import { trpc } from "../lib/trpc";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, MapPin, TrendingUp, TrendingDown, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MeusLances() {
  const navigate = useNavigate();
  const { data: bids, isLoading } = trpc.userBids.myBids.useQuery();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", variant: "default" as const, icon: Clock },
      outbid: { label: "Superado", variant: "destructive" as const, icon: TrendingDown },
      won: { label: "Venceu", variant: "success" as const, icon: Trophy },
      lost: { label: "Perdeu", variant: "secondary" as const, icon: TrendingDown },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Data não disponível";
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const activeBids = bids?.filter((bid) => bid.status === "active") || [];
  const wonBids = bids?.filter((bid) => bid.status === "won") || [];
  const lostBids = bids?.filter((bid) => bid.status === "lost" || bid.status === "outbid") || [];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Lances</h1>
          <p className="text-muted-foreground">
            Acompanhe todos os seus lances em leilões
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lances Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeBids.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em andamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lances Vencidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{wonBids.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Parabéns! 🎉
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Lances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bids?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Todos os tempos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bids List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Carregando seus lances...</p>
          </div>
        ) : !bids || bids.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lance ainda</h3>
              <p className="text-muted-foreground mb-6">
                Comece a dar lances em veículos que você gosta!
              </p>
              <Button onClick={() => navigate("/encontrar-veiculo")}>
                Explorar Veículos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Active Bids */}
            {activeBids.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Lances Ativos</h2>
                <div className="grid grid-cols-1 gap-4">
                  {activeBids.map((bid) => (
                    <Card key={bid.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Vehicle Image */}
                          <div className="w-full md:w-48 h-36 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {bid.vehicleImage ? (
                              <img
                                src={bid.vehicleImage}
                                alt={bid.vehicleTitle || "Veículo"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sem imagem
                              </div>
                            )}
                          </div>

                          {/* Bid Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">
                                  {bid.vehicleTitle || "Título não disponível"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Lote: {bid.vehicleLotNumber}
                                </p>
                              </div>
                              {getStatusBadge(bid.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Seu Lance</p>
                                <p className="text-lg font-bold text-primary">
                                  {formatCurrency(bid.amount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Lance Atual</p>
                                <p className="text-lg font-semibold">
                                  {formatCurrency(bid.vehicleCurrentBid || 0)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              {bid.vehicleLocation && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {bid.vehicleLocation}
                                </div>
                              )}
                              {bid.vehicleAuctionDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(bid.vehicleAuctionDate)}
                                </div>
                              )}
                            </div>

                            <div className="mt-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/veiculo/${bid.vehicleId}`)}
                              >
                                Ver Detalhes
                              </Button>
                              {bid.amount < (bid.vehicleCurrentBid || 0) && (
                                <Button size="sm">
                                  Aumentar Lance
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Won Bids */}
            {wonBids.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-green-600">Lances Vencidos 🏆</h2>
                <div className="grid grid-cols-1 gap-4">
                  {wonBids.map((bid) => (
                    <Card key={bid.id} className="border-green-200 bg-green-50/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-48 h-36 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {bid.vehicleImage ? (
                              <img
                                src={bid.vehicleImage}
                                alt={bid.vehicleTitle || "Veículo"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sem imagem
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">
                                  {bid.vehicleTitle || "Título não disponível"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Lote: {bid.vehicleLotNumber}
                                </p>
                              </div>
                              {getStatusBadge(bid.status)}
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-muted-foreground mb-1">Lance Vencedor</p>
                              <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(bid.amount)}
                              </p>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/veiculo/${bid.vehicleId}`)}
                            >
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Lost/Outbid Bids */}
            {lostBids.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Histórico</h2>
                <div className="grid grid-cols-1 gap-4">
                  {lostBids.map((bid) => (
                    <Card key={bid.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-48 h-36 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {bid.vehicleImage ? (
                              <img
                                src={bid.vehicleImage}
                                alt={bid.vehicleTitle || "Veículo"}
                                className="w-full h-full object-cover grayscale"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sem imagem
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">
                                  {bid.vehicleTitle || "Título não disponível"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Lote: {bid.vehicleLotNumber}
                                </p>
                              </div>
                              {getStatusBadge(bid.status)}
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-muted-foreground mb-1">Seu Lance</p>
                              <p className="text-lg font-semibold">
                                {formatCurrency(bid.amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
