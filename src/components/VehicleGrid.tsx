import { VehicleCard } from "./VehicleCard";

interface Vehicle {
  _id: string;
  lotNumber: string;
  year: number;
  make: string;
  model: string;
  currentBid: number;
  estimatedRetailValue: number;
  saleDate: string;
  saleTime: string;
  location: string;
  primaryDamage: string;
  odometer: number;
  status: "upcoming" | "live" | "sold";
  imageUrls?: (string | null)[];
  [key: string]: any;
}

interface VehicleGridProps {
  vehicles: any[];
  setCurrentView?: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void;
  setSelectedVehicleId?: (id: string | null) => void;
}

export function VehicleGrid({ vehicles, setCurrentView, setSelectedVehicleId }: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">Nenhum veículo encontrado</p>
        <p className="text-gray-400 mt-2">Tente ajustar os filtros de busca ou explore outras categorias</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle._id} 
          vehicle={vehicle} 
          setCurrentView={setCurrentView}
          setSelectedVehicleId={setSelectedVehicleId}
        />
      ))}
    </div>
  );
}
