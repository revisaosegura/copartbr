import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { VehicleSearch } from "./components/VehicleSearch";
import { VehicleGrid } from "./components/VehicleGrid";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { AuctionSchedule } from "./components/AuctionSchedule";
import { Footer } from "./components/Footer";
import { VehicleDetail } from "./components/VehicleDetail";
import { HowItWorks } from "./components/HowItWorks";
import { Stats } from "./components/Stats";

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works'>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1">
        <Content 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          selectedVehicleId={selectedVehicleId}
          setSelectedVehicleId={setSelectedVehicleId}
        />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}

function Content({ 
  currentView, 
  setCurrentView, 
  selectedVehicleId, 
  setSelectedVehicleId 
}: { 
  currentView: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works',
  setCurrentView: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void,
  selectedVehicleId: string | null,
  setSelectedVehicleId: (id: string | null) => void
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentView === 'search') {
    return <VehicleSearch setCurrentView={setCurrentView} setSelectedVehicleId={setSelectedVehicleId} />;
  }

  if (currentView === 'vehicle' && selectedVehicleId) {
    return <VehicleDetail vehicleId={selectedVehicleId} setCurrentView={setCurrentView} />;
  }

  if (currentView === 'how-it-works') {
    return <HowItWorks />;
  }

  if (currentView === 'watchlist') {
    return (
      <Authenticated>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Minha Lista de Observação</h1>
          <WatchlistContent setCurrentView={setCurrentView} setSelectedVehicleId={setSelectedVehicleId} />
        </div>
      </Authenticated>
    );
  }

  return (
    <div>
      <Hero setCurrentView={setCurrentView} />
      
      <Unauthenticated>
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Entre na sua conta</h2>
              <SignInForm />
            </div>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <Stats />
        
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Veículos em Destaque</h2>
          <FeaturedVehicles setCurrentView={setCurrentView} setSelectedVehicleId={setSelectedVehicleId} />
        </div>
        
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Próximos Leilões</h2>
            <AuctionSchedule />
          </div>
        </div>
      </Authenticated>
    </div>
  );
}

function FeaturedVehicles({ setCurrentView, setSelectedVehicleId }: {
  setCurrentView: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void,
  setSelectedVehicleId: (id: string | null) => void
}) {
  const vehicles = useQuery(api.vehicles.getFeaturedVehicles);
  
  if (!vehicles) {
    return <div className="text-center">Carregando veículos...</div>;
  }

  return <VehicleGrid vehicles={vehicles} setCurrentView={setCurrentView} setSelectedVehicleId={setSelectedVehicleId} />;
}

function WatchlistContent({ setCurrentView, setSelectedVehicleId }: {
  setCurrentView: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void,
  setSelectedVehicleId: (id: string | null) => void
}) {
  const watchlist = useQuery(api.vehicles.getWatchlist);
  
  if (!watchlist) {
    return <div className="text-center">Carregando lista...</div>;
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Sua lista de observação está vazia</p>
        <p className="text-gray-400 mt-2">Adicione veículos à sua lista para acompanhar os leilões</p>
      </div>
    );
  }

  return <VehicleGrid vehicles={watchlist.filter(Boolean)} setCurrentView={setCurrentView} setSelectedVehicleId={setSelectedVehicleId} />;
}
