import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface VehicleDetailProps {
  vehicleId: string;
  setCurrentView: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void;
}

export function VehicleDetail({ vehicleId, setCurrentView }: VehicleDetailProps) {
  const vehicle = useQuery(api.vehicles.getVehicleById, { id: vehicleId as any });
  const [bidAmount, setBidAmount] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const placeBid = useMutation(api.vehicles.placeBid);
  const addToWatchlist = useMutation(api.vehicles.addToWatchlist);

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Carregando detalhes do veículo...</p>
        </div>
      </div>
    );
  }

  const handleBid = async () => {
    try {
      const amount = parseFloat(bidAmount);
      if (amount <= vehicle.currentBid) {
        toast.error("O lance deve ser maior que o lance atual");
        return;
      }
      
      await placeBid({
        vehicleId: vehicle._id as any,
        amount: amount,
      });
      
      toast.success("Lance realizado com sucesso!");
      setBidAmount("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer lance");
    }
  };

  const handleWatchlist = async () => {
    try {
      const added = await addToWatchlist({ vehicleId: vehicle._id as any });
      toast.success(added ? "Adicionado à lista de observação" : "Removido da lista de observação");
    } catch (error) {
      toast.error("Erro ao atualizar lista de observação");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = () => {
    switch (vehicle.status) {
      case 'live':
        return <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">● AO VIVO</span>;
      case 'upcoming':
        return <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">PRÓXIMO</span>;
      case 'sold':
        return <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-bold">VENDIDO</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('search')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Voltar à Busca
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-96 bg-gray-200">
              {vehicle.imageUrls && vehicle.imageUrls.length > 0 && vehicle.imageUrls[selectedImageIndex] ? (
                <img
                  src={vehicle.imageUrls[selectedImageIndex]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
                    </svg>
                    <span>Sem Imagem Disponível</span>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4">
                {getStatusBadge()}
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm">
                  Lote #{vehicle.lotNumber}
                </span>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {vehicle.imageUrls && vehicle.imageUrls.length > 1 && (
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {vehicle.imageUrls.map((url, index) => (
                  url && (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-gray-600 mb-4">{vehicle.location}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Lance Atual</span>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(vehicle.currentBid)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Valor Estimado</span>
                  <div className="text-xl font-semibold">{formatCurrency(vehicle.estimatedRetailValue)}</div>
                </div>
              </div>

              {/* Bid Section */}
              {vehicle.status !== 'sold' && (
                <div className="space-y-4 mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder={`Mínimo: ${formatCurrency(vehicle.currentBid + 100)}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleBid}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Fazer Lance
                    </button>
                  </div>
                  <button
                    onClick={handleWatchlist}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Adicionar à Lista de Observação
                  </button>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p><strong>Data do Leilão:</strong> {new Date(vehicle.saleDate).toLocaleDateString('pt-BR')} às {vehicle.saleTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Informações do Veículo</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">VIN:</span>
                <div className="font-semibold">{vehicle.vin}</div>
              </div>
              <div>
                <span className="text-gray-600">Cor:</span>
                <div className="font-semibold">{vehicle.color}</div>
              </div>
              <div>
                <span className="text-gray-600">Quilometragem:</span>
                <div className="font-semibold">{vehicle.odometer.toLocaleString('pt-BR')} km</div>
              </div>
              <div>
                <span className="text-gray-600">Combustível:</span>
                <div className="font-semibold">{vehicle.fuel}</div>
              </div>
              <div>
                <span className="text-gray-600">Transmissão:</span>
                <div className="font-semibold">{vehicle.transmission}</div>
              </div>
              <div>
                <span className="text-gray-600">Motor:</span>
                <div className="font-semibold">{vehicle.engine}</div>
              </div>
              <div>
                <span className="text-gray-600">Carroceria:</span>
                <div className="font-semibold">{vehicle.bodyStyle}</div>
              </div>
              <div>
                <span className="text-gray-600">Condição:</span>
                <div className="font-semibold">{vehicle.condition}</div>
              </div>
              <div>
                <span className="text-gray-600">Dano Principal:</span>
                <div className="font-semibold text-red-600">{vehicle.primaryDamage}</div>
              </div>
              <div>
                <span className="text-gray-600">Dano Secundário:</span>
                <div className="font-semibold">{vehicle.secondaryDamage || 'Nenhum'}</div>
              </div>
              <div>
                <span className="text-gray-600">Tipo de Título:</span>
                <div className="font-semibold">{vehicle.titleType}</div>
              </div>
              <div>
                <span className="text-gray-600">Chaves:</span>
                <div className="font-semibold">{vehicle.keys ? 'Sim' : 'Não'}</div>
              </div>
            </div>
          </div>

          {/* Recent Bids */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Lances Recentes</h2>
            {vehicle.recentBids && vehicle.recentBids.length > 0 ? (
              <div className="space-y-2">
                {vehicle.recentBids.map((bid, index) => (
                  <div key={bid._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      {new Date(bid.timestamp).toLocaleString('pt-BR')}
                    </span>
                    <span className={`font-semibold ${bid.isWinning ? 'text-green-600' : 'text-gray-900'}`}>
                      {formatCurrency(bid.amount)}
                      {bid.isWinning && <span className="text-xs ml-1">(Vencendo)</span>}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum lance ainda</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
