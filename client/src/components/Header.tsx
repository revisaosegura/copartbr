import { Search, Globe, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-[#003087] text-white">
      {/* Top Bar */}
      <div className="container py-3 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center">
            <span className="text-3xl font-bold italic tracking-tight">Copart</span>
          </a>
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

        {/* Right Section */}
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
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded shadow-lg z-50">
                <div className="p-4">
                  <p className="font-semibold mb-2">Idioma do Website</p>
                  <select className="w-full p-2 border rounded">
                    <option>Português</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <Link href="/registrar">
            <a>
              <Button variant="outline" className="bg-[#FDB714] hover:bg-[#e5a512] text-black border-none font-semibold">
                Registrar
              </Button>
            </a>
          </Link>
          <Link href="/entrar">
            <a>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#003087]">
                Entrar
              </Button>
            </a>
          </Link>
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
                <Link href="/">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Início</a>
                </Link>
              </li>
              <li>
                <Link href="/como-funciona">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Como Funciona</a>
                </Link>
              </li>
              <li>
                <Link href="/encontrar-veiculo">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Encontrar um Veículo</a>
                </Link>
              </li>
              <li>
                <Link href="/leiloes">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Leilões</a>
                </Link>
              </li>
              <li>
                <Link href="/localizacoes">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Localizações</a>
                </Link>
              </li>
              <li>
                <Link href="/suporte">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Suporte</a>
                </Link>
              </li>
              <li>
                <Link href="/vender-meu-carro">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Vender Meu Carro</a>
                </Link>
              </li>
              <li>
                <Link href="/venda-direta">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Venda Direta</a>
                </Link>
              </li>
              <li>
                <Link href="/achar-pecas">
                  <a className="block px-4 py-2 hover:bg-[#003087] transition-colors">Achar Peças</a>
                </Link>
              </li>
              <li className="pt-4 border-t border-[#003087]">
                <Link href="/registrar">
                  <a className="block px-4 py-2 bg-[#FDB714] text-black font-semibold rounded text-center">Registrar</a>
                </Link>
              </li>
              <li>
                <Link href="/entrar">
                  <a className="block px-4 py-2 border border-white rounded text-center">Entrar</a>
                </Link>
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
              <Link href="/">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Início
                </a>
              </Link>
            </li>
            <li>
              <Link href="/como-funciona">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Como Funciona
                </a>
              </Link>
            </li>
            <li>
              <Link href="/encontrar-veiculo">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Encontrar um Veículo
                </a>
              </Link>
            </li>
            <li>
              <Link href="/leiloes">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Leilões
                </a>
              </Link>
            </li>
            <li>
              <Link href="/localizacoes">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Localizações
                </a>
              </Link>
            </li>
            <li>
              <Link href="/suporte">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Suporte
                </a>
              </Link>
            </li>
            <li>
              <Link href="/vender-meu-carro">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Vender Meu Carro
                </a>
              </Link>
            </li>
            <li>
              <Link href="/venda-direta">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Venda Direta
                </a>
              </Link>
            </li>
            <li>
              <Link href="/achar-pecas">
                <a className="block px-4 py-3 hover:bg-[#003087] transition-colors">
                  Achar Peças
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
