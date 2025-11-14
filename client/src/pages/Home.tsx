import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
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

const HERO_CARDS = [
  {
    title: "Venda Direta",
    features: [
      "Disponível 24h por dia",
      "Veículos com laudo",
      "Negociação intermediada",
      "Diversas opções com garantia",
    ],
    primaryCta: { label: "Comprar", href: "/buscar?venda=direta" },
    secondaryCta: { label: "Vender", href: "/vender-meu-carro" },
  },
  {
    title: "Leilão",
    features: [
      "+ de 70 leilões mensais",
      "De Bancos, Seguradoras, e mais",
      "Faça seus lances online",
      "Veículos com procedência",
    ],
    primaryCta: { label: "Comprar", href: "/leiloes" },
    secondaryCta: { label: "Vender", href: "/vender-meu-carro" },
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
  const [activeInventoryTab, setActiveInventoryTab] = useState<InventoryTabKey>("popular");

  const { data: auctions, isLoading: isLoadingAuctions } =
    trpc.vehicles.upcomingAuctions.useQuery({ limit: 4 });

  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    trpc.vehicles.list.useQuery({ limit: 8 });

  const featuredVehicles = vehiclesData?.items ?? [];
  const liveAuctionsCount = auctions?.length ?? 0;

  const handleQuickFilter = (filter: string) => {
    setLocation(`/buscar?q=${encodeURIComponent(filter)}`);
  };

  const inventoryContent = useMemo(() => INVENTORY_CONTENT[activeInventoryTab], [activeInventoryTab]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#041238] text-white">
          <div className="absolute inset-0">
            <img
              src="/car3.jpg"
              alt="Showroom Copart"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030b21] via-[#031c52]/95 to-[#0d45b8]/90" aria-hidden="true" />
          </div>

          <div className="relative container py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,560px)_minmax(0,460px)] items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight max-w-2xl">
                  Conectando <span className="text-[#fdb714]">compradores</span> e <span className="text-[#fdb714]">vendedores</span>{" "}
                  ao redor do mundo.
                </h1>
                <p className="text-lg md:text-xl text-white/85 max-w-xl">
                  São + de <span className="text-[#fdb714]">12,640</span> veículos disponíveis para compra online. De automóveis a
                  caminhões, motocicletas e muito mais.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {HERO_CARDS.map(card => (
                  <div
                    key={card.title}
                    className="rounded-[28px] bg-[#071d4a]/95 shadow-[0_25px_60px_-25px_rgba(8,24,66,0.85)] overflow-hidden"
                  >
                    <div className="space-y-4 px-7 pt-7 pb-6">
                      <h2 className="text-2xl font-bold text-[#fdb714]">{card.title}</h2>
                      <ul className="space-y-2 text-sm text-white/90">
                        {card.features.map(feature => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 text-[#fdb714]" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white px-6 pb-6 pt-4 flex flex-col gap-3">
                      <Button
                        className="h-11 rounded-xl bg-[#fdb714] text-[#0b2a64] font-semibold hover:bg-[#e7a90f]"
                        onClick={() => setLocation(card.primaryCta.href)}
                      >
                        {card.primaryCta.label}
                      </Button>
                      <Button
                        className="h-11 rounded-xl bg-[#fdb714] text-[#0b2a64] font-semibold hover:bg-[#e7a90f]"
                        onClick={() => setLocation(card.secondaryCta.href)}
                      >
                        {card.secondaryCta.label}
                      </Button>
                    </div>
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
