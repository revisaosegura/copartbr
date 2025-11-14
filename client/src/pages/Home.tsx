import { useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Search,
  ShieldCheck,
  Twitter,
  Youtube,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

const HERO_STATS = [
  { label: "Veículos disponíveis hoje", value: "12.600+" },
  { label: "Pátios pelo Brasil", value: "14" },
  { label: "Lotes publicados por dia", value: "500" },
];

const HERO_CARDS = [
  {
    title: "Venda Direta",
    highlight: "Disponível 24 horas por dia",
    bullets: [
      "Veículos com documentação e laudo",
      "Negociação imediata sem disputa",
      "Condição pronta para lojistas",
    ],
    cta: { label: "Comprar", href: "/buscar?venda=direta" },
  },
  {
    title: "Leilão",
    highlight: "Lotes novos diariamente",
    bullets: [
      "Lances em tempo real com streaming",
      "Veículos de seguradoras e frotas",
      "Diversas categorias e estados",
    ],
    cta: { label: "Participar", href: "/leiloes" },
  },
];

const OPPORTUNITY_CARDS = [
  {
    title: "Nos Leilões",
    description:
      "Escolha seu veículo em nosso catálogo, verifique a localização e veja o histórico completo. Lotes com fotos, laudos e vídeos.",
  },
  {
    title: "Compre na Venda Direta",
    description:
      "Selecionamos veículos disponíveis agora mesmo, com documentação regularizada e condições especiais para lojistas e consumidores.",
  },
  {
    title: "Venda com a Copart",
    description:
      "Atuamos junto aos modelos credenciados em todas as etapas. Copart cuida de todo o processo, da avaliação à entrega.",
  },
];

const INVENTORY_TABS = [
  { key: "popular", label: "Pesquisas Populares" },
  { key: "destaques", label: "Destaques" },
  { key: "marcas", label: "Marcas" },
  { key: "categorias", label: "Categorias" },
];

const INVENTORY_CONTENT = {
  popular: {
    columns: [
      {
        title: "Itens Mais Populares",
        items: [
          "Fiat",
          "Volkswagen",
          "Honda",
          "Ford",
          "Peugeot",
          "Chevrolet",
          "Motocicletas",
          "Pequena Monta",
        ],
      },
      {
        title: "Marcas / modelos",
        items: [
          "Renault",
          "Citroën",
          "Gol",
          "Palio",
          "Fiesta",
          "Fox",
          "Onix",
          "Civic",
        ],
      },
      {
        title: "Buscas frequentes",
        items: [
          "Motor de partida",
          "Motos",
          "SUVs",
          "Picapes",
          "Utilitários",
          "Pequenos reparos",
          "Blocos",
          "Sucatas",
        ],
      },
    ],
    highlight: {
      title: "Lojista, você também pode vender conosco!",
      description:
        "Cadastre seu estoque e tenha acesso a milhões de compradores com soluções completas de logística e documentação.",
      cta: { label: "Confira", href: "/vender-meu-carro" },
    },
  },
  destaques: {
    columns: [
      {
        title: "Veículos buscados",
        items: [
          "SUV premium",
          "Sedans executivos",
          "Veículos seminovos",
          "Blindados",
          "Importados",
          "Utilitários leves",
          "Caminhões",
          "Pequena monta",
        ],
      },
      {
        title: "Estados em alta",
        items: [
          "São Paulo",
          "Rio de Janeiro",
          "Minas Gerais",
          "Paraná",
          "Bahia",
          "Pernambuco",
          "Santa Catarina",
          "Rio Grande do Sul",
        ],
      },
      {
        title: "Próximos eventos",
        items: [
          "Agenda de Leilões",
          "Venda Direta",
          "Leilões Online",
          "Leilões Presenciais",
          "Cadastro de compradores",
          "Documentos necessários",
          "Planos corporativos",
          "Copart Play",
        ],
      },
    ],
    highlight: {
      title: "Faça seu cadastro",
      description:
        "Atendemos a uma audiência diversificada, de consumidores finais a lojistas e desmontes credenciados. Seja protagonista na Copart.",
      cta: { label: "Cadastre-se", href: "/registrar" },
    },
  },
  marcas: {
    columns: [
      {
        title: "Principais",
        items: [
          "Audi",
          "BMW",
          "Chevrolet",
          "Fiat",
          "Ford",
          "Honda",
          "Hyundai",
          "Jeep",
        ],
      },
      {
        title: "Mais buscadas",
        items: [
          "Kia",
          "Mercedes-Benz",
          "Mitsubishi",
          "Nissan",
          "Peugeot",
          "Renault",
          "Toyota",
          "Volkswagen",
        ],
      },
      {
        title: "Segmentos",
        items: [
          "Compactos",
          "SUV",
          "Pickups",
          "Motocicletas",
          "Caminhões",
          "Utilitários",
          "Máquinas",
          "Peças",
        ],
      },
    ],
    highlight: {
      title: "Assine a Copart Play",
      description:
        "Acompanhe transmissões ao vivo, tutoriais exclusivos e conteúdo para potencializar seus resultados nos leilões.",
      cta: { label: "Assistir", href: "/videos" },
    },
  },
  categorias: {
    columns: [
      {
        title: "Tipos de venda",
        items: [
          "Leilão",
          "Venda Direta",
          "Venda Corporativa",
          "Venda para lojistas",
          "Venda para frotas",
          "Venda de peças",
          "Venda de sucatas",
          "Venda internacional",
        ],
      },
      {
        title: "Condições",
        items: [
          "Pequena monta",
          "Média monta",
          "Grande monta",
          "Perda total",
          "Leilão especial",
          "Veículos recuperados",
          "Veículos salvados",
          "Veículos seminovos",
        ],
      },
      {
        title: "Outros filtros",
        items: [
          "Ano",
          "Combustível",
          "Quilometragem",
          "Localização",
          "Categoria",
          "Número do lote",
          "Preço",
          "Tipo de documento",
        ],
      },
    ],
    highlight: {
      title: "Precisa de ajuda?",
      description:
        "Conte com os especialistas Copart para orientar sobre cadastro, lances, pagamento e retirada do veículo.",
      cta: { label: "Fale conosco", href: "/suporte" },
    },
  },
} as const;

type InventoryTabKey = keyof typeof INVENTORY_CONTENT;

const COPART_SEGMENTS = [
  {
    title: "Quem é a Copart?",
    description:
      "Descubra a Copart, a plataforma líder em compra e venda de veículos. Reunimos um dos maiores inventários do mercado, com tecnologia exclusiva e alcance global para ligar vendedores aos compradores certos.",
  },
  {
    title: "Atendimento especializado",
    description:
      "Atendemos a consumidores finais, lojistas e seguradoras com total transparência e flexibilidade. Seja participante de um leilão ou vendedor com grande estoque, a Copart transforma a experiência em resultados.",
  },
];

const COPART_CATEGORIES = [
  {
    title: "Venda Direta",
    items: ["Veículos prontos", "Pequena Monta", "Média Monta", "Grande Monta"],
  },
  {
    title: "Automóveis",
    items: ["Veículos urbanos", "SUV", "Pequena Monta", "Média Monta"],
  },
  {
    title: "Caminhões",
    items: ["Pesados", "Semipesados", "Utilitários", "Pequena Monta"],
  },
  {
    title: "Motocicletas",
    items: ["CG 160", "CG 125", "Scooters", "Trail"],
  },
];

const SOCIAL_LINKS = [
  { label: "Facebook", icon: Facebook, href: "https://www.facebook.com/CopartBrasil" },
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/copartbr" },
  { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/copart" },
  { label: "YouTube", icon: Youtube, href: "https://www.youtube.com/user/CopartInc" },
  { label: "Twitter", icon: Twitter, href: "https://twitter.com/Copart" },
];

const PARTNER_SLIDES = [
  [
    "Consórcio Embracon",
    "Gente Seguradora",
    "Gol Plus",
    "Justos",
    "Usebens",
    "BPorto",
  ],
  [
    "Allianz",
    "Banco Toyota",
    "CNP Seguradora",
    "Consórcio Embracon",
    "Gente Seguradora",
    "Gol Plus",
  ],
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeInventoryTab, setActiveInventoryTab] = useState<InventoryTabKey>("popular");

  const { data: auctions, isLoading: isLoadingAuctions } =
    trpc.vehicles.upcomingAuctions.useQuery({ limit: 4 });

  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    trpc.vehicles.list.useQuery({ limit: 8 });

  const featuredVehicles = vehiclesData?.items ?? [];
  const liveAuctionsCount = auctions?.length ?? 0;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setLocation(`/buscar?q=${encodeURIComponent(trimmed)}`);
  };

  const handleQuickFilter = (filter: string) => {
    setLocation(`/buscar?q=${encodeURIComponent(filter)}`);
  };

  const inventoryContent = useMemo(() => INVENTORY_CONTENT[activeInventoryTab], [activeInventoryTab]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#001a3d] text-white">
          <div className="absolute inset-0">
            <img
              src="/car4.jpg"
              alt="Frota Copart"
              className="absolute bottom-0 right-0 h-full w-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050b21] via-[#002a6b]/95 to-[#004b8d]/90" aria-hidden="true" />
          </div>

          <div className="relative container py-12 lg:py-20 space-y-10">
            <div className="inline-flex items-center gap-2 bg-white/95 text-[#001b45] px-4 py-2 rounded-full text-sm shadow-lg">
              <span className="font-semibold uppercase tracking-[0.18em] text-[11px] text-[#003087]">Aviso</span>
              <span className="text-sm font-medium">
                No dia 14/11, devido ao feriado municipal, nossa unidade de Goiânia não estará em funcionamento.
              </span>
            </div>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,620px)_1fr] items-start">
              <div className="space-y-10">
                <div className="space-y-4 max-w-2xl">
                  <span className="inline-flex bg-[#fdb714] text-[#001b45] text-xs font-semibold uppercase tracking-[0.2em] px-5 py-2 rounded-full">
                    Plataforma oficial Copart Brasil
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight">
                    Conectando compradores e vendedores ao redor do mundo.
                  </h1>
                  <p className="text-lg md:text-xl text-white/85">
                    São + de 12.600 veículos disponíveis para compra online. De automóveis a caminhões, motocicletas e muito mais.
                  </p>
                </div>

                <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 space-y-4">
                  <label className="text-xs uppercase tracking-[0.3em] font-semibold text-[#003087] block">
                    Pesquisar inventário
                  </label>
                  <div className="relative flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                        placeholder="Procurar por Marca, Modelo, Descrição, Chassi ou Número do Lote"
                        className="w-full rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#fdb714]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-[#fdb714] hover:bg-[#e7a90f] text-black font-semibold px-8 py-3 rounded-xl"
                    >
                      Buscar
                    </Button>
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {HERO_STATS.map(stat => (
                    <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 px-6 py-5 shadow-lg">
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-white/80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6">
                {HERO_CARDS.map(card => (
                  <div key={card.title} className="bg-white/95 text-[#001b45] rounded-3xl shadow-2xl p-8 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-2xl font-bold">{card.title}</h2>
                      <Badge className="bg-[#001b45] text-white px-3 py-1 rounded-full text-xs uppercase tracking-widest">
                        Copart Brasil
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold uppercase text-[#0050b5] tracking-[0.3em]">
                      {card.highlight}
                    </p>
                    <ul className="space-y-2 text-sm text-[#002a6b]">
                      {card.bullets.map(item => (
                        <li key={item} className="flex items-start gap-2">
                          <ShieldCheck className="mt-1 h-4 w-4 text-[#0050b5]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="bg-[#003087] hover:bg-[#001f5a] text-white font-semibold rounded-xl"
                      onClick={() => setLocation(card.cta.href)}
                    >
                      {card.cta.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">Veículos em destaque</h2>
                <p className="text-gray-600">
                  Explore oportunidades selecionadas com base nas buscas e leilões em destaque desta semana.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  className="bg-[#00a650] hover:bg-[#008843] text-white font-semibold rounded-full px-6"
                  onClick={() => setLocation("/leiloes")}
                >
                  {liveAuctionsCount > 0
                    ? `${liveAuctionsCount} Leilão${liveAuctionsCount > 1 ? "es" : ""} ao Vivo Acontecendo Agora!`
                    : "Agenda completa de leilões"}
                </Button>
                <Button
                  variant="outline"
                  className="border-[#002366] text-[#002366] hover:bg-[#002366] hover:text-white rounded-full"
                  onClick={() => setLocation("/encontrar-veiculo")}
                >
                  Ver todos os veículos
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="-mx-4 px-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {isLoadingVehicles && (
                    <p className="col-span-full text-center text-gray-500">Carregando destaques...</p>
                  )}
                  {!isLoadingVehicles && featuredVehicles.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      Nenhum veículo disponível no momento. Volte em breve!
                    </p>
                  )}
                  {featuredVehicles.map(vehicle => {
                    const displayTitle =
                      vehicle.title ||
                      [vehicle.brand, vehicle.model, vehicle.year]
                        .filter(Boolean)
                        .join(" ") ||
                      "Veículo Copart";

                    return (
                      <VehicleCard
                        key={vehicle.id}
                        id={String(vehicle.id)}
                        image={vehicle.image ?? ""}
                        title={displayTitle}
                        lotNumber={vehicle.lotNumber}
                        currentBid={`R$ ${(vehicle.currentBid / 100).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`}
                        location={vehicle.location ?? ""}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#eff4ff] via-white to-[#eff4ff] py-14">
          <div className="container space-y-10">
            <div className="text-center space-y-3">
              <Badge className="mx-auto bg-[#001f5a] text-white uppercase tracking-widest px-4 py-1">
                Experiência Copart
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">Um mar de oportunidades</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Mais opções, mais vantagens e toda a segurança que você procura para comprar e vender com a Copart Brasil.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {OPPORTUNITY_CARDS.map(card => (
                <Card key={card.title} className="border-[#002366]/10 shadow-sm h-full">
                  <CardContent className="p-7 space-y-4">
                    <h3 className="text-2xl font-semibold text-[#002366]">{card.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container space-y-8">
            <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-4">
              {INVENTORY_TABS.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveInventoryTab(tab.key as InventoryTabKey)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeInventoryTab === tab.key
                      ? "bg-[#002366] text-white"
                      : "bg-gray-100 text-[#002366] hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {inventoryContent.columns.map(column => (
                  <Card key={column.title} className="border-[#002366]/10">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#002366] uppercase tracking-widest">
                          {column.title}
                        </h3>
                        <ChevronRight className="text-[#002366]/40" size={20} />
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                        {column.items.map(item => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleQuickFilter(item)}
                            className="text-left hover:text-[#002366]"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-[#002366]/10 bg-gradient-to-br from-[#001b45] via-[#002a6b] to-[#00112c] text-white">
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-2xl font-semibold leading-snug">
                    {inventoryContent.highlight.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {inventoryContent.highlight.description}
                  </p>
                  <Button
                    className="bg-[#fdb714] hover:bg-[#e7a90f] text-black font-semibold rounded-full"
                    onClick={() => setLocation(inventoryContent.highlight.cta.href)}
                  >
                    {inventoryContent.highlight.cta.label}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-[#001b45] text-white py-16">
          <div className="container grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_1fr] items-start">
            <div className="space-y-10">
              {COPART_SEGMENTS.map(segment => (
                <div key={segment.title} className="space-y-3">
                  <h2 className="text-3xl font-bold">{segment.title}</h2>
                  <p className="text-white/80 leading-relaxed">{segment.description}</p>
                </div>
              ))}
              <Button
                className="bg-[#fdb714] hover:bg-[#e7a90f] text-black font-semibold rounded-full"
                onClick={() => setLocation("/registrar")}
              >
                Faça seu cadastro
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-semibold">Copart: sua plataforma de compra e venda online de veículos!</h3>
              <div className="grid gap-4">
                {COPART_CATEGORIES.map(category => (
                  <div key={category.title} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">{category.title}</h4>
                      <Badge className="bg-white/20 text-white uppercase tracking-widest">Confira</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-white/70">
                      {category.items.map(item => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-white/10"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#022b74] via-[#01235b] to-[#031536] text-white py-14">
          <div className="container grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Nossas Mídias Sociais</h2>
              <p className="text-white/80">
                Cadastre-se agora para explorar uma ampla variedade de veículos, caminhões, motos, SUVs e muito mais.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {SOCIAL_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002366] text-center">Nossos Parceiros</h2>
            <div className="space-y-6">
              {PARTNER_SLIDES.map((slide, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-6 md:gap-10 px-6 py-6 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  {slide.map(partner => (
                    <div
                      key={partner}
                      className="h-12 flex items-center justify-center px-6 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-600"
                    >
                      {partner}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7fc] py-16">
          <div className="container space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">Agenda de leilões</h2>
                <p className="text-gray-600">
                  Fique por dentro das próximas oportunidades em nossos pátios e programe os seus lances com antecedência.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#002366] text-[#002366] hover:bg-[#002366] hover:text-white rounded-full"
                onClick={() => setLocation("/calendario-leiloes")}
              >
                Ver calendário completo
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {isLoadingAuctions && (
                <p className="col-span-full text-center text-gray-500">Carregando agenda...</p>
              )}
              {!isLoadingAuctions && (!auctions || auctions.length === 0) && (
                <p className="col-span-full text-center text-gray-500">Nenhum leilão programado para os próximos dias.</p>
              )}
              {auctions?.map(auction => (
                <Card key={auction.id} className="border-[#002366]/10">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[#002366] font-semibold text-sm uppercase tracking-widest">
                      <CalendarDays size={16} />
                      {format(new Date(auction.auctionDate), "dd 'de' MMMM", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{auction.location ?? "Localização não informada"}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {auction.vehicleCount} veículo{auction.vehicleCount === 1 ? "" : "s"} em estoque
                    </p>
                    {auction.auctionTimes.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs text-[#002366] font-semibold">
                        {auction.auctionTimes.map(time => (
                          <span key={time} className="px-3 py-1 rounded-full bg-[#002366]/10">
                            {time}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="border-[#002366] text-[#002366] hover:bg-[#002366] hover:text-white rounded-full"
                      onClick={() => setLocation(`/leiloes/${encodeURIComponent(auction.id)}`)}
                    >
                      Visualizar veículos
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
