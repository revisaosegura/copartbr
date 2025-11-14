import { Link } from "wouter";

const FOOTER_COLUMNS = [
  {
    title: "Sobre a Copart",
    items: [
      { label: "Copart Global", href: "/copart-global" },
      { label: "História da Copart", href: "/historia" },
      { label: "Notícias da Copart", href: "/noticias" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Leilões",
    items: [
      { label: "Localizador de Veículos", href: "/buscar" },
      { label: "Leilões ao Vivo", href: "/leiloes" },
      { label: "Calendário de Leilões", href: "/calendario-leiloes" },
      { label: "Saiba Mais Sobre Montas", href: "/montas" },
    ],
  },
  {
    title: "Localização dos Pátios",
    items: [
      { label: "Europa", href: "/patios/europa" },
      { label: "América do Sul", href: "/patios/america-do-sul" },
      { label: "América do Norte", href: "/patios/america-do-norte" },
      { label: "Ásia", href: "/patios/asia" },
    ],
  },
  {
    title: "Suporte",
    items: [
      { label: "Como Comprar", href: "/como-comprar" },
      { label: "Perguntas Frequentes", href: "/perguntas-frequentes" },
      { label: "Glossário", href: "/glossario" },
      { label: "Assessoria de Imprensa", href: "/imprensa" },
    ],
  },
  {
    title: "Conecte-se Conosco",
    items: [
      { label: "Fale Conosco", href: "/contato" },
      { label: "Imprensa", href: "/imprensa" },
      { label: "Trabalhe Conosco", href: "/carreiras" },
      { label: "Investidores", href: "/investidores" },
    ],
  },
];

const FOOTER_LINKS = [
  { label: "Minha Conta", href: "/conta" },
  { label: "Meu Veículo", href: "/meu-veiculo" },
  { label: "Vender Meu Carro", href: "/vender-meu-carro" },
  { label: "Termos de Uso", href: "/termos" },
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Política de Cookies", href: "/cookies" },
  { label: "Mapa do Site", href: "/mapa-do-site" },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-8 md:mt-12 lg:mt-16">
      <div className="border-b border-white/10">
        <div className="container py-10 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            <div className="space-y-4 max-w-sm">
              <img src="/copart-logo.png" alt="Copart" className="h-10" />
              <p className="text-sm text-white/70">
                Copart Brasil conecta compradores e vendedores com a plataforma líder mundial em leilões e venda direta de veículos recuperados, salvados e seminovos.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                <div className="border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                  <span>Português</span>
                </div>
                <div className="border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                  <span>Brazil</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10 flex-1">
              {FOOTER_COLUMNS.map(column => (
                <div key={column.title} className="space-y-3">
                  <h3 className="text-base font-semibold uppercase tracking-widest text-white/80">
                    {column.title}
                  </h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    {column.items.map(item => (
                      <li key={item.label}>
                        <Link href={item.href}>
                          <a className="hover:text-white transition-colors">{item.label}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10">
        <div className="container py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-white/60">
            {FOOTER_LINKS.map(link => (
              <Link key={link.label} href={link.href}>
                <a className="hover:text-white transition-colors">{link.label}</a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8 text-center text-xs text-white/50">
        <p>Copyright © {new Date().getFullYear()} Copart Inc. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
