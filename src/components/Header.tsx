import { Authenticated, Unauthenticated } from "convex/react";
import { SignOutButton } from "../SignOutButton";

interface HeaderProps {
  currentView: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works';
  setCurrentView: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void;
}

export function Header({ currentView, setCurrentView }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">Copart</span>
                <span className="text-xs text-gray-500 -mt-1">BRASIL</span>
              </div>
            </button>
            
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentView === 'home' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => setCurrentView('search')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentView === 'search' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Buscar Veículos
              </button>
              <button
                onClick={() => setCurrentView('how-it-works')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentView === 'how-it-works' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Como Funciona
              </button>
              <Authenticated>
                <button
                  onClick={() => setCurrentView('watchlist')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    currentView === 'watchlist' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Lista de Observação
                </button>
              </Authenticated>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Unauthenticated>
              <span className="text-sm text-gray-600 hidden md:block">Faça login para participar dos leilões</span>
            </Unauthenticated>
            <Authenticated>
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Minha Conta</span>
                </div>
                <SignOutButton />
              </div>
            </Authenticated>
          </div>
        </div>
      </div>
    </header>
  );
}
