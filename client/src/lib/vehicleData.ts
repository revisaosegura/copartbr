// Gerador de dados simulados realistas de veículos

export interface Vehicle {
  id: string;
  title: string;
  lotNumber: string;
  currentBid: string;
  location: string;
  year: string;
  brand: string;
  model: string;
  color: string;
  fuel: string;
  transmission: string;
  mileage: string;
  condition: string;
  auctionDate: string;
  image: string;
  images: string[];
}

const brands = [
  "FERRARI", "PORSCHE", "BMW", "MERCEDES-BENZ", "AUDI", "VOLKSWAGEN", 
  "TOYOTA", "HONDA", "FORD", "CHEVROLET", "FIAT", "JEEP", "HYUNDAI",
  "NISSAN", "RENAULT", "PEUGEOT", "CITROËN", "KIA", "MITSUBISHI"
];

const models: Record<string, string[]> = {
  "FERRARI": ["SF90 STRADALE", "F8 TRIBUTO", "ROMA", "PORTOFINO"],
  "PORSCHE": ["911 CARRERA", "CAYENNE", "MACAN", "PANAMERA"],
  "BMW": ["X5 M SPORT", "320i", "X1", "X3", "530i"],
  "MERCEDES-BENZ": ["C180", "GLC 300", "A200", "E250"],
  "VOLKSWAGEN": ["SAVEIRO", "GOL", "POLO", "T-CROSS", "TIGUAN"],
  "TOYOTA": ["COROLLA", "HILUX", "RAV4", "YARIS", "CAMRY"],
  "HONDA": ["CIVIC", "HR-V", "CR-V", "FIT", "CITY"],
  "FORD": ["MUSTANG", "RANGER", "ECOSPORT", "KA", "FUSION"],
  "CHEVROLET": ["ONIX", "TRACKER", "S10", "CRUZE", "SPIN"],
  "JEEP": ["COMPASS", "RENEGADE", "COMMANDER", "WRANGLER"],
};

const colors = ["Preto", "Branco", "Prata", "Vermelho", "Azul", "Cinza", "Verde"];
const fuels = ["Gasolina", "Flex", "Diesel", "Híbrido", "Elétrico"];
const transmissions = ["Manual", "Automática", "Automatizada"];
const conditions = ["Excelente", "Muito Bom", "Bom", "Regular", "Recuperável"];

const locations = [
  "São Paulo - SP",
  "Rio de Janeiro - RJ",
  "Curitiba - PR",
  "Porto Alegre - RS",
  "Belo Horizonte - MG",
  "Goiânia - GO",
  "Brasília - DF",
  "Salvador - BA",
  "Recife - PE",
  "Fortaleza - CE",
  "Embú das Artes - SP",
  "Leilão Pátio Porto Seguro - SP",
];

const carImages = ["/car1.jpg", "/car2.jpg", "/car3.jpg", "/car4.jpg"];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatPrice(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR")} BRL`;
}

function generateLotNumber(): string {
  return `${randomNumber(1000000, 1099999)}`;
}

function generateAuctionDate(): string {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const day = randomNumber(1, 28);
  const month = randomItem(months);
  return `${day} de ${month}, 2024`;
}

export function generateVehicle(id?: string): Vehicle {
  const brand = randomItem(brands);
  const modelList = models[brand] || ["MODELO"];
  const model = randomItem(modelList);
  const year = randomNumber(2010, 2024).toString();
  const mileage = randomNumber(1000, 150000);
  const price = randomNumber(10000, 500000);

  return {
    id: id || generateLotNumber(),
    title: `${year} ${brand} ${model}`,
    lotNumber: generateLotNumber(),
    currentBid: formatPrice(price),
    location: randomItem(locations),
    year,
    brand,
    model,
    color: randomItem(colors),
    fuel: randomItem(fuels),
    transmission: randomItem(transmissions),
    mileage: `${mileage.toLocaleString("pt-BR")} km`,
    condition: randomItem(conditions),
    auctionDate: generateAuctionDate(),
    image: randomItem(carImages),
    images: carImages,
  };
}

export function generateVehicles(count: number): Vehicle[] {
  return Array.from({ length: count }, (_, i) => generateVehicle((i + 1).toString()));
}

// Gerar veículos iniciais
let vehicleDatabase = generateVehicles(50);

export function getVehicles(limit?: number): Vehicle[] {
  return limit ? vehicleDatabase.slice(0, limit) : vehicleDatabase;
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicleDatabase.find(v => v.id === id || v.lotNumber === id);
}

export function getFeaturedVehicles(count: number = 4): Vehicle[] {
  return vehicleDatabase.slice(0, count);
}

// Atualizar dados periodicamente (simular mudanças de preço)
export function updateVehiclePrices(): void {
  vehicleDatabase = vehicleDatabase.map(vehicle => {
    // 30% de chance de atualizar o preço
    if (Math.random() < 0.3) {
      const currentPrice = parseInt(vehicle.currentBid.replace(/[^\d]/g, ""));
      const change = randomNumber(-5000, 10000);
      const newPrice = Math.max(5000, currentPrice + change);
      return {
        ...vehicle,
        currentBid: formatPrice(newPrice),
      };
    }
    return vehicle;
  });
}

// Adicionar novos veículos periodicamente
export function addNewVehicles(count: number = 5): void {
  const newVehicles = generateVehicles(count);
  vehicleDatabase = [...newVehicles, ...vehicleDatabase].slice(0, 100); // Manter no máximo 100
}
