import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface Vehicle {
  id: number;
  title: string;
  lotNumber: string;
  currentBid: number;
  views: number;
}

interface MostViewedVehiclesProps {
  data: Vehicle[];
  isLoading?: boolean;
}

export function MostViewedVehicles({ data, isLoading }: MostViewedVehiclesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Veículos Mais Visualizados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Carregando dados...</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Veículos Mais Visualizados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Veículos Mais Visualizados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((vehicle, index) => (
            <div key={vehicle.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003087] text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm">{vehicle.title}</p>
                  <p className="text-xs text-gray-500">Lote: {vehicle.lotNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Eye className="w-4 h-4" />
                  <span>{vehicle.views.toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-xs text-[#003087] font-semibold">
                  R$ {(vehicle.currentBid / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
