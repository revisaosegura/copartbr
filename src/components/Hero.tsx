interface HeroProps {
  setCurrentView: (view: 'home' | 'search' | 'watchlist' | 'vehicle' | 'how-it-works') => void;
}

export function Hero({ setCurrentView }: HeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Leilões de Veículos
            <span className="block text-blue-200">Online no Brasil</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Encontre veículos salvage, clean title, motocicletas e equipamentos pesados 
            em nossos leilões online. Milhares de oportunidades todos os dias.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setCurrentView('search')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Buscar Veículos Agora
            </button>
            <button 
              onClick={() => setCurrentView('how-it-works')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              Como Funciona
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-200">Veículos por mês</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-200">Leilões semanais</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-200">Estados atendidos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
