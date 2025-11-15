import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Buscar() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';

  const { data: searchResults, isLoading } = trpc.vehicles.search.useQuery(
    { query, limit: 50 },
    { enabled: query.length >= 2 }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-[#003087] mb-2">
            Resultados da Busca
          </h1>
          <p className="text-gray-600 mb-6">
            {query ? `Buscando por: "${query}"` : 'Digite um termo de busca'}
          </p>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-[#003087]" size={48} />
            </div>
          )}

          {!isLoading && searchResults && searchResults.length > 0 && (
            <>
              <p className="text-gray-700 mb-6 font-semibold">
                {searchResults.length} {searchResults.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    id={String(vehicle.id)}
                    lotNumber={vehicle.lotNumber}
                    title={vehicle.title}
                    currentBidCents={vehicle.currentBid}
                    location={vehicle.location}
                    image={vehicle.image}
                    saleStatus={vehicle.saleStatus ?? undefined}
                    auctionDate={vehicle.auctionDate ?? undefined}
                    description={vehicle.description ?? undefined}
                  />
                ))}
              </div>
            </>
          )}

          {!isLoading && searchResults && searchResults.length === 0 && query.length >= 2 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                Nenhum veículo encontrado para "{query}"
              </p>
              <p className="text-gray-500">
                Tente usar termos diferentes ou mais gerais
              </p>
            </div>
          )}

          {!query && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                Digite um termo de busca para encontrar veículos
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
