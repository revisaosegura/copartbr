import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface VehicleCardProps {
  vehicle: any;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const addToWatchlist = useMutation(api.vehicles.addToWatchlist);

  const handleWatchlist = async () => {
    try {
      const result = await addToWatchlist({ vehicleId: vehicle._id });
      toast.success(result.added ? "Added to watchlist" : "Removed from watchlist");
    } catch (error) {
      toast.error("Failed to update watchlist");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="relative">
        {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
          <img
            src={vehicle.imageUrls[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-400 text-4xl">🚗</span>
          </div>
        )}
        
        <button
          onClick={handleWatchlist}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <span className="text-red-500">♥</span>
        </button>

        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
            Lot #{vehicle.lotNumber}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Mileage:</span>
            <span>{vehicle.mileage.toLocaleString()} mi</span>
          </div>
          
          <div className="flex justify-between">
            <span>Condition:</span>
            <span className="font-medium">{vehicle.condition}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Damage:</span>
            <span>{vehicle.damage}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Location:</span>
            <span>{vehicle.location}</span>
          </div>
        </div>

        {vehicle.auction && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Current Bid:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(vehicle.auction.currentBid)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sale Date:</span>
              <span className="text-sm font-medium">
                {formatDate(vehicle.saleDate)}
              </span>
            </div>
          </div>
        )}

        <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
