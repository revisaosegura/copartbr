import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VehicleGrid } from "./VehicleGrid";

interface VehicleSearchProps {
  setCurrentView?: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void;
  setSelectedVehicleId?: (id: string | null) => void;
}

export function VehicleSearch({ setCurrentView, setSelectedVehicleId }: VehicleSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    location: "",
    status: "",
  });

  const vehicles = useQuery(api.vehicles.searchVehicles, {
    searchTerm: searchTerm || undefined,
    make: filters.make || undefined,
    model: filters.model || undefined,
    yearFrom: filters.yearFrom ? parseInt(filters.yearFrom) : undefined,
    yearTo: filters.yearTo ? parseInt(filters.yearTo) : undefined,
    location: filters.location || undefined,
    status: filters.status || undefined,
    limit: 50,
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      make: "",
      model: "",
      yearFrom: "",
      yearTo: "",
      location: "",
      status: "",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Buscar Veículos</h1>
          <p className="text-gray-600">Encontre o veículo perfeito em nossos leilões online</p>
        </div>
        
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Busca Geral
            </label>
            <input
              type="text"
              placeholder="Buscar por modelo, marca, VIN, lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <select
                value={filters.make}
                onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as Marcas</option>
                <option value="TOYOTA">Toyota</option>
                <option value="HONDA">Honda</option>
                <option value="VOLKSWAGEN">Volkswagen</option>
                <option value="FORD">Ford</option>
                <option value="CHEVROLET">Chevrolet</option>
                <option value="HYUNDAI">Hyundai</option>
                <option value="NISSAN">Nissan</option>
                <option value="BMW">BMW</option>
                <option value="MERCEDES-BENZ">Mercedes-Benz</option>
                <option value="AUDI">Audi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                placeholder="Modelo"
                value={filters.model}
                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano de</label>
              <input
                type="number"
                placeholder="2000"
                value={filters.yearFrom}
                onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano até</label>
              <input
                type="number"
                placeholder="2024"
                value={filters.yearTo}
                onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as Localidades</option>
                <option value="SÃO PAULO">São Paulo - SP</option>
                <option value="RIO DE JANEIRO">Rio de Janeiro - RJ</option>
                <option value="BELO HORIZONTE">Belo Horizonte - MG</option>
                <option value="CURITIBA">Curitiba - PR</option>
                <option value="PORTO ALEGRE">Porto Alegre - RS</option>
                <option value="SALVADOR">Salvador - BA</option>
                <option value="BRASÍLIA">Brasília - DF</option>
                <option value="FORTALEZA">Fortaleza - CE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os Status</option>
                <option value="upcoming">Próximos</option>
                <option value="live">Ao Vivo</option>
                <option value="sold">Vendidos</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpar Filtros
            </button>
            <div className="text-sm text-gray-600">
              {vehicles ? `${vehicles.length} veículos encontrados` : 'Carregando...'}
            </div>
          </div>
        </div>

        {/* Results */}
        {vehicles ? (
          <VehicleGrid 
            vehicles={vehicles} 
            setCurrentView={setCurrentView}
            setSelectedVehicleId={setSelectedVehicleId}
          />
        ) : (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando veículos...</p>
          </div>
        )}
      </div>
    </div>
  );
}
