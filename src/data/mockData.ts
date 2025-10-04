// Mock data for demo purposes

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  sku: string;
  basePrice: number;
  createdAt: string;
}

export interface AuctionHeader {
  id: string;
  name: string;
  numberOfPeople: number;
  date: string;
  exchangeRate: number; // Yuan to USD
  createdAt: string;
}

export interface AuctionDetail {
  id: string;
  auctionId: string;
  type: string;
  weight: number;
  bagNumber: string;
  numberOfPieces: number;
  winner1: string;
  winner2: string;
  lot: string;
  date: string;
  highestBidRMB: number;
  pricePerKgUSD: number;
  priceSoldUSD: number;
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Smith Enterprises',
    address: '123 Main St, New York, NY 10001',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 987-6543',
    company: 'Johnson & Co.',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    createdAt: '2024-01-20T14:15:00Z',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@trading.com',
    phone: '+1 (555) 456-7890',
    company: 'Chen Trading Ltd',
    address: '789 Pine St, San Francisco, CA 94102',
    createdAt: '2024-01-25T09:45:00Z',
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Tea',
    description: 'Premium tea varieties from various regions',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: '2',
    name: 'Ceramics',
    description: 'Traditional and modern ceramic pieces',
    createdAt: '2024-01-12T10:30:00Z',
  },
  {
    id: '3',
    name: 'Textiles',
    description: 'Fine fabrics and textile products',
    createdAt: '2024-01-14T13:20:00Z',
  },
  {
    id: '4',
    name: 'Artwork',
    description: 'Paintings, sculptures, and other art pieces',
    createdAt: '2024-01-16T16:45:00Z',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Dragon Well Green Tea',
    description: 'Premium Longjing green tea from Hangzhou',
    categoryId: '1',
    sku: 'TEA-001',
    basePrice: 85.50,
    createdAt: '2024-01-18T11:00:00Z',
  },
  {
    id: '2',
    name: 'Ming Dynasty Vase',
    description: 'Replica of traditional Ming dynasty ceramic vase',
    categoryId: '2',
    sku: 'CER-001',
    basePrice: 450.00,
    createdAt: '2024-01-19T15:30:00Z',
  },
  {
    id: '3',
    name: 'Silk Scarf',
    description: 'Hand-woven silk scarf with traditional patterns',
    categoryId: '3',
    sku: 'TEX-001',
    basePrice: 120.75,
    createdAt: '2024-01-21T09:15:00Z',
  },
  {
    id: '4',
    name: 'Calligraphy Painting',
    description: 'Traditional Chinese calligraphy artwork',
    categoryId: '4',
    sku: 'ART-001',
    basePrice: 280.00,
    createdAt: '2024-01-22T14:45:00Z',
  },
];

export const mockAuctionHeaders: AuctionHeader[] = [
  {
    id: '1',
    name: 'Spring Tea Auction 2024',
    numberOfPeople: 45,
    date: '2024-03-15',
    exchangeRate: 0.14, // 1 Yuan = 0.14 USD
    createdAt: '2024-01-25T10:00:00Z',
  },
  {
    id: '2',
    name: 'Ceramic Art Collection',
    numberOfPeople: 28,
    date: '2024-03-22',
    exchangeRate: 0.139,
    createdAt: '2024-01-26T11:30:00Z',
  },
];

export const mockAuctionDetails: AuctionDetail[] = [
  {
    id: '1',
    auctionId: '1',
    type: 'Green Tea',
    weight: 5.2,
    bagNumber: 'GT-001',
    numberOfPieces: 10,
    winner1: 'John Smith',
    winner2: 'Sarah Johnson',
    lot: 'A-001',
    date: '2024-03-15',
    highestBidRMB: 3200,
    pricePerKgUSD: 86.15,
    priceSoldUSD: 448.00,
  },
  {
    id: '2',
    auctionId: '1',
    type: 'Oolong Tea',
    weight: 3.8,
    bagNumber: 'OT-002',
    numberOfPieces: 8,
    winner1: 'Michael Chen',
    winner2: '',
    lot: 'A-002',
    date: '2024-03-15',
    highestBidRMB: 2800,
    pricePerKgUSD: 103.20,
    priceSoldUSD: 392.16,
  },
  {
    id: '3',
    auctionId: '2',
    type: 'Porcelain Vase',
    weight: 2.1,
    bagNumber: 'PV-001',
    numberOfPieces: 1,
    winner1: 'Sarah Johnson',
    winner2: '',
    lot: 'B-001',
    date: '2024-03-22',
    highestBidRMB: 5600,
    pricePerKgUSD: 371.43,
    priceSoldUSD: 778.40,
  },
];