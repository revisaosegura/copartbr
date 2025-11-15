import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Award, Users } from 'lucide-react';

interface BidStats {
  totalBids: number;
  vehiclesWithBids: number;
  totalBidValue: number;
  averageBidValue: number;
  topBiddedVehicles: Array<{
    id: number;
    title: string;
    lotNumber: string;
    highestBid: number;
  }>;
}

interface BidStatisticsProps {
  data: BidStats | null;
  isLoading?: boolean;
}

export function BidStatistics({ data, isLoading }: BidStatisticsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500">Nenhum dado disponível</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lances</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalBids.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lances registrados na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos com Lances</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.vehiclesWithBids.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Veículos que receberam pelo menos um lance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total em Lances</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(data.totalBidValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Soma de todos os lances
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lance Médio</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(data.averageBidValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor médio por veículo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Bidded Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Veículos com Maiores Lances</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topBiddedVehicles && data.topBiddedVehicles.length > 0 ? (
            <div className="space-y-3">
              {data.topBiddedVehicles.map((vehicle, index) => (
                <div key={vehicle.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{vehicle.title}</p>
                      <p className="text-xs text-gray-500">Lote: {vehicle.lotNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#003087]">
                      R$ {(vehicle.highestBid / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum lance registrado</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
