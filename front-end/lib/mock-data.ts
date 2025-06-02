export interface Opportunity {
  id: string;
  name: string;
  institution: string;
  logo: string;
  status: string;
  regulation: string;
  type: string;
  yield: string;
  minInvestment: string;
  term: string;
  totalVolume: string;
  riskScore: number;
  cdiComparison: string;
  capturedAmount: string;
  availableAmount: string;
}

export interface Portfolio {
  totalBalance: string;
  availableBalance: string;
  investedBalance: string;
  expectedReturn: string;
  tokens: {
    id: string;
    name: string;
    amount: string;
    purchaseDate: string;
    expectedReturn: string;
    maturityDate: string;
  }[];
}

export const mockPortfolio: Portfolio = {
  totalBalance: "0,00",
  availableBalance: "0,00",
  investedBalance: "0,00",
  expectedReturn: "0,00",
  tokens: []
};

export const bestOpportunities: Opportunity[] = [
  {
    id: "001",
    name: "ILPI São Vicente",
    institution: "São Vicente Care",
    logo: "https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Em captação",
    regulation: "88",
    type: "CR",
    yield: "15,84%",
    minInvestment: "25,00",
    term: "314",
    totalVolume: "30.432,67",
    riskScore: 25,
    cdiComparison: "115",
    capturedAmount: "20.789,45",
    availableAmount: "9.643,22"
  },
  {
    id: "002",
    name: "Lar dos Idosos",
    institution: "Nagro Securitizadora S/A",
    logo: "https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Em captação",
    regulation: "88",
    type: "CR",
    yield: "15,56%",
    minInvestment: "25,00",
    term: "704",
    totalVolume: "35.678,91",
    riskScore: 65,
    cdiComparison: "112",
    capturedAmount: "25.432,67",
    availableAmount: "10.246,24"
  },
  {
    id: "003",
    name: "Casa Melhor Idade",
    institution: "M3 Lending",
    logo: "https://images.pexels.com/photos/7551704/pexels-photo-7551704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Finalizada",
    regulation: "88",
    type: "CR",
    yield: "16,41%",
    minInvestment: "25,00",
    term: "360",
    totalVolume: "40.123,45",
    riskScore: 85,
    cdiComparison: "118",
    capturedAmount: "40.123,45",
    availableAmount: "0,00"
  }
];

export const allTokens: Opportunity[] = [
  ...bestOpportunities,
  {
    id: "004",
    name: "ILPI Boa Esperança",
    institution: "Boa Esperança Care",
    logo: "https://images.pexels.com/photos/7551622/pexels-photo-7551622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Em captação",
    regulation: "88",
    type: "CR",
    yield: "14,75%",
    minInvestment: "25,00",
    term: "450",
    totalVolume: "44.567,89",
    riskScore: 45,
    cdiComparison: "108",
    capturedAmount: "34.425,92",
    availableAmount: "10.141,97"
  },
  {
    id: "005",
    name: "Residencial Sênior",
    institution: "Sênior Invest",
    logo: "https://images.pexels.com/photos/7551692/pexels-photo-7551692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Em captação",
    regulation: "88",
    type: "CR",
    yield: "15,30%",
    minInvestment: "25,00",
    term: "420",
    totalVolume: "47.432,67",
    riskScore: 75,
    cdiComparison: "120",
    capturedAmount: "35.678,91",
    availableAmount: "11.753,76"
  },
  {
    id: "006",
    name: "Casa Aconchego",
    institution: "Aconchego Vida",
    logo: "https://images.pexels.com/photos/7551727/pexels-photo-7551727.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "Finalizada",
    regulation: "88",
    type: "CR",
    yield: "14,90%",
    minInvestment: "25,00",
    term: "270",
    totalVolume: "49.789,45",
    riskScore: 35,
    cdiComparison: "105",
    capturedAmount: "49.789,45",
    availableAmount: "0,00"
  }
];