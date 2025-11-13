import { Search, Globe, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="bg-[#003087] text-white">
      {/* Top Bar */}
      <div className="container py-2 md:py-3 flex items-center justify-between gap-2">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/copart-logo.png" alt="Copart" className="h-8 md:h-10 lg:h-12" />
        </Link>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <div className="relative flex items-center bg-white rounded">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Procurar por Marca, Modelo, Descrição, Chassis ou Número do Lote"
              className="w-full pl-10 pr-4 py-2 text-gray-900 rounded-l focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold px-6 rounded-l-none">
              Buscar
            </Button>
          </div>
        </div>

        {/* Right Section - Mobile Buttons */}
        <div className="flex lg:hidden items-center gap-2">
          <Link href="/registrar">
            <Button size="sm" className="bg-[#FDB714] hover:bg-[#e5a512] text-black border-none font-semibold text-xs px-3 py-1">
              Registrar
            </Button>
          </Link>
          <Link href="/entrar">
            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-[#003087] text-xs px-3 py-1">
              Entrar
            </Button>
          </Link>
        </div>

        {/* Right Section - Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <button
              className="flex items-center gap-2 hover:opacity-80"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <Globe size={20} />
              <span className="text-sm">BRAZIL | Português</span>
            </button>
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded shadow-lg z-50">
                <div className="p-4">
                  <p className="font-semibold mb-2">Idioma do Website</p>
                  <select className="w-full p-2 border rounded mb-4">
                    <option>Português</option>
                    <option>English</option>
                  </select>
                  <p className="font-semibold mb-2">Região do Website</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">USA</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">CANADA</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">UK</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">IRELAND</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">UAE(Dubai)</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">BAHRAIN</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">OMAN</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">GERMANY</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">SPAIN</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded">FINLAND</button>
                    <button className="px-3 py-2 text-left hover:bg-gray-100 rounded font-semibold bg-gray-100">BRAZIL</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/registrar">
            <Button variant="outline" className="bg-[#FDB714] hover:bg-[#e5a512] text-black border-none font-semibold">
              Registrar
            </Button>
          </Link>
          <div className="relative">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#003087]"
              onClick={() => setShowLoginMenu(!showLoginMenu)}
            >
              Entrar
            </Button>
            {showLoginMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded shadow-lg z-50">
                <Link href="/entrar?tipo=comprador" className="block px-4 py-2 hover:bg-gray-100">
                  Comprador/Arrematante
                </Link>
                <Link href="/entrar?tipo=comitente" className="block px-4 py-2 hover:bg-gray-100">
                  Comitente
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-[#002366] border-t border-[#003087]">
          <div className="container py-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full px-4 py-2 rounded text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Início</Link>
              </li>
              <li>
                <Link href="/como-funciona" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Como Funciona</Link>
              </li>
              <li>
                <Link href="/encontrar-veiculo" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Encontrar um Veículo</Link>
              </li>
              <li>
                <Link href="/leiloes" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Leilões</Link>
              </li>
              <li>
                <Link href="/localizacoes" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Localizações</Link>
              </li>
              <li>
                <Link href="/suporte" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Suporte</Link>
              </li>
              <li>
                <Link href="/vender-meu-carro" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Vender Meu Carro</Link>
              </li>
              <li>
                <Link href="/venda-direta" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Venda Direta</Link>
              </li>
              <li>
                <Link href="/achar-pecas" className="block px-4 py-2 hover:bg-[#003087] transition-colors">Achar Peças</Link>
              </li>
              <li className="pt-4 border-t border-[#003087]">
                <Link href="/registrar" className="block px-4 py-2 bg-[#FDB714] text-black font-semibold rounded text-center">Registrar</Link>
              </li>
              <li>
                <Link href="/entrar" className="block px-4 py-2 border border-white rounded text-center">Entrar</Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="hidden lg:block bg-[#002366] border-t border-[#003087]">
        <div className="container">
          <ul className="flex items-center gap-1">
            <li>
              <Link href="/" className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link href="/como-funciona" className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                Como Funciona
              </Link>
            </li>
            <li 
              className="relative"
              onMouseEnter={() => setActiveDropdown('encontrar')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center px-4 py-3 hover:bg-[#003087] transition-colors cursor-pointer">
                Encontrar um Veículo
                <ChevronDown size={16} className="ml-1" />
              </div>
              {activeDropdown === 'encontrar' && (
                <div className="absolute left-0 mt-0 w-56 bg-[#002366] shadow-lg z-50 border-t-2 border-[#FDB714]">
                  <Link href="/encontrar-veiculo" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Localizador de Veículos
                  </Link>
                  <Link href="/lista-vendas" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Lista de Vendas
                  </Link>
                  <Link href="/favoritos" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Favoritos
                  </Link>
                  <Link href="/pesquisas-salvas" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Pesquisas Salvas
                  </Link>
                  <Link href="/alerta-veiculos" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Alerta de Veículos
                  </Link>
                </div>
              )}
            </li>
            <li 
              className="relative"
              onMouseEnter={() => setActiveDropdown('leiloes')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center px-4 py-3 hover:bg-[#003087] transition-colors cursor-pointer">
                Leilões
                <ChevronDown size={16} className="ml-1" />
              </div>
              {activeDropdown === 'leiloes' && (
                <div className="absolute left-0 mt-0 w-56 bg-[#002366] shadow-lg z-50 border-t-2 border-[#FDB714]">
                  <Link href="/leiloes-hoje" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Leilões de Hoje
                  </Link>
                  <Link href="/calendario-leiloes" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Calendário de Leilões
                  </Link>
                </div>
              )}
            </li>
            <li>
              <Link href="/localizacoes" className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                Localizações
              </Link>
            </li>
            <li 
              className="relative"
              onMouseEnter={() => setActiveDropdown('suporte')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center px-4 py-3 hover:bg-[#003087] transition-colors cursor-pointer">
                Suporte
                <ChevronDown size={16} className="ml-1" />
              </div>
              {activeDropdown === 'suporte' && (
                <div className="absolute left-0 mt-0 w-56 bg-[#002366] shadow-lg z-50 border-t-2 border-[#FDB714]">
                  <Link href="/como-comprar" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Como Comprar
                  </Link>
                  <Link href="/perguntas-comuns" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Perguntas Comuns
                  </Link>
                  <Link href="/videos" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Vídeos
                  </Link>
                  <Link href="/precisa-ajuda" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Precisa de Ajuda?
                  </Link>
                </div>
              )}
            </li>
            <li>
              <Link href="/vender-meu-carro" className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                Vender Meu Carro
              </Link>
            </li>
            <li 
              className="relative"
              onMouseEnter={() => setActiveDropdown('venda-direta')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center px-4 py-3 hover:bg-[#003087] transition-colors cursor-pointer">
                Venda Direta
                <ChevronDown size={16} className="ml-1" />
              </div>
              {activeDropdown === 'venda-direta' && (
                <div className="absolute left-0 mt-0 w-56 bg-[#002366] shadow-lg z-50 border-t-2 border-[#FDB714]">
                  <Link href="/venda-direta/ofertas" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    Veja as Ofertas
                  </Link>
                  <Link href="/venda-direta/sobre" className="block px-4 py-2 hover:bg-[#003087] transition-colors">
                    O que é Venda Direta?
                  </Link>
                </div>
              )}
            </li>
            <li>
              <Link href="/achar-pecas" className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                Achar Peças
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
