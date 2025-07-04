// Mock data for recommended partners
export interface RecommendedPartner {
  id: number;
  name: string;
  logo: string;
  sector: string;
  location: string;
  rating: number;
  connections: number;
}

export const recommendedPartners: RecommendedPartner[] = [
  {
    id: 1,
    name: "Pacific Logistics Co.",
    logo: "PL",
    sector: "Logistics Provider",
    location: "Los Angeles, CA",
    rating: 4.8,
    connections: 150
  },
  {
    id: 2,
    name: "Global Exports Inc.",
    logo: "GE",
    sector: "Exporter",
    location: "Singapore",
    rating: 4.9,
    connections: 230
  },
  {
    id: 3,
    name: "Customs Solutions",
    logo: "CS",
    sector: "Customs Broker",
    location: "Miami, FL",
    rating: 4.7,
    connections: 89
  },
  {
    id: 4,
    name: "Maritime Shipping",
    logo: "MS",
    sector: "Ocean Freight",
    location: "Rotterdam, NL",
    rating: 4.6,
    connections: 180
  },
  {
    id: 5,
    name: "Air Cargo Express",
    logo: "AC",
    sector: "Air Freight",
    location: "Dubai, UAE",
    rating: 4.8,
    connections: 120
  },
  {
    id: 6,
    name: "Inland Transport",
    logo: "IT",
    sector: "Trucking",
    location: "Dallas, TX",
    rating: 4.5,
    connections: 95
  }
]; 