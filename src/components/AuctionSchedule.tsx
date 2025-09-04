import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function AuctionSchedule() {
  const upcomingAuctions = useQuery(api.auctions.getUpcomingAuctions);
  const liveAuctions = useQuery(api.auctions.getLiveAuctions);

  if (!upcomingAuctions || !liveAuctions) {
    return <div className="text-center">Carregando leilões...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Live Auctions */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-red-600">Leilões Ao Vivo</h3>
        {liveAuctions.length === 0 ? (
          <p className="text-gray-500">Nenhum leilão ao vivo no momento</p>
        ) : (
          <div className="space-y-4">
            {liveAuctions.map((auction) => (
              <div key={auction._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold">{auction.name}</h4>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    AO VIVO
                  </span>
                </div>
                <div className="text-gray-600 space-y-1">
                  <p><strong>Data:</strong> {new Date(auction.date).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Horário:</strong> {auction.time}</p>
                  <p><strong>Local:</strong> {auction.location}</p>
                  <p><strong>Veículos:</strong> {auction.vehicleCount}</p>
                </div>
                <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Participar Agora
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Auctions */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-blue-600">Próximos Leilões</h3>
        {upcomingAuctions.length === 0 ? (
          <p className="text-gray-500">Nenhum leilão programado</p>
        ) : (
          <div className="space-y-4">
            {upcomingAuctions.map((auction) => (
              <div key={auction._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold">{auction.name}</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    PRÓXIMO
                  </span>
                </div>
                <div className="text-gray-600 space-y-1">
                  <p><strong>Data:</strong> {new Date(auction.date).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Horário:</strong> {auction.time}</p>
                  <p><strong>Local:</strong> {auction.location}</p>
                  <p><strong>Veículos:</strong> {auction.vehicleCount}</p>
                </div>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Ver Veículos
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
