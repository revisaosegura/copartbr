import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#002366] text-white mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sobre a Copart</h3>
            <p className="text-sm text-gray-300">
              Plataforma líder em compra e venda de veículos online. Conectando compradores e vendedores ao redor do mundo.
            </p>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/como-funciona">
                  <a className="text-gray-300 hover:text-white transition-colors">Como Funciona</a>
                </Link>
              </li>
              <li>
                <Link href="/encontrar-veiculo">
                  <a className="text-gray-300 hover:text-white transition-colors">Encontrar um Veículo</a>
                </Link>
              </li>
              <li>
                <Link href="/leiloes">
                  <a className="text-gray-300 hover:text-white transition-colors">Leilões</a>
                </Link>
              </li>
              <li>
                <Link href="/venda-direta">
                  <a className="text-gray-300 hover:text-white transition-colors">Venda Direta</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Suporte */}
          <div>
            <h3 className="text-xl font-bold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/suporte">
                  <a className="text-gray-300 hover:text-white transition-colors">Central de Ajuda</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Perguntas Frequentes</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Contato</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: contato@copart.com.br</li>
              <li>Tel: 0800 123 4567</li>
              <li>Horário: Seg-Sex 8h-18h</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Copart Brasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
