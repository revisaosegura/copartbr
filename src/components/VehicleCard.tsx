import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface VehicleCardProps {
  vehicle: any;
  setCurrentView?: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void;
  setSelectedVehicleId?: (id: string | null) => void;
}

export function VehicleCard({ vehicle, setCurrentView, setSelectedVehicleId }: VehicleCardProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  
  const placeBid = useMutation(api.vehicles.placeBid);
  const addToWatchlist = useMutation(api.vehicles.addToWatchlist);

  const handleBid = async () => {
    try {
      const amount = parseFloat(bidAmount);
      if (amount <= vehicle.currentBid) {
        toast.error("O lance deve ser maior que o lance atual");
        return;
      }
      
      await placeBid({
        vehicleId: vehicle._id,
        amount,
      });
      
      toast.success("Lance realizado com sucesso!");
      setBidAmount("");
      setShowBidForm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer lance");
    }
  };

  const handleWatchlist = async () => {
    try {
      const added = await addToWatchlist({ vehicleId: vehicle._id });
      setIsWatchlisted(added);
      toast.success(added ? "Adicionado à lista de observação" : "Removido da lista de observação");
    } catch {
      toast.error("Erro ao atualizar lista de observação");
    }
  };

  const handleViewDetails = () => {
    if (setCurrentView && setSelectedVehicleId) {
      setSelectedVehicleId(vehicle._id);
      setCurrentView('vehicle');
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
        return <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">● AO VIVO</span>;
      case 'upcoming':
        return <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">PRÓXIMO</span>;
      case 'sold':
        return <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">VENDIDO</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={handleViewDetails}>
        {vehicle.imageUrls && vehicle.imageUrls[0] ? (
          <img
            src={vehicle.imageUrls[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
              </svg>
              <span className="text-sm">Sem Imagem</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              void handleWatchlist();
            }}
            className={`p-2 rounded-full shadow-lg transition-all ${
              isWatchlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill={isWatchlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            Lote #{vehicle.lotNumber}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3 cursor-pointer" onClick={handleViewDetails}>
          <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-500">{vehicle.location}</p>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Lance Atual:</span>
            <span className="font-bold text-lg text-green-600">{formatCurrency(vehicle.currentBid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valor Estimado:</span>
            <span className="font-semibold">{formatCurrency(vehicle.estimatedRetailValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quilometragem:</span>
            <span>{vehicle.odometer.toLocaleString('pt-BR')} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dano:</span>
            <span className="text-red-600 font-medium">{vehicle.primaryDamage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Leilão:</span>
            <span>{new Date(vehicle.saleDate).toLocaleDateString('pt-BR')} {vehicle.saleTime}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleViewDetails}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Ver Detalhes
          </button>
          
          {vehicle.status !== 'sold' && (
            <>
              {!showBidForm ? (
                <button
                  onClick={() => setShowBidForm(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Fazer Lance
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder={`Mínimo: ${formatCurrency(vehicle.currentBid + 100)}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                      <button
                        onClick={() => void handleBid()}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setShowBidForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
