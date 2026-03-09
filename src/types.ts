export type Language = 'bn' | 'en' | 'hi';
export type InvoiceTheme = 'premium' | 'classic' | 'modern' | 'minimal' | 'retro' | 'elegant' | 'industrial' | 'organic' | 'brutalist' | 'futuristic' | 'corporate' | 'playful' | 'darkLuxury' | 'technical';

export interface ShopDetails {
  name: string;
  phone: string;
  gst: string;
  email: string;
  description: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  address: string;
  terms: string;
  logo?: string;
}

export interface InvoiceItem {
  id: string;
  modelNumber: string;
  imeiNumber: string;
  price: number;
  qty: number;
}

export interface CustomerDetails {
  name: string;
  address: string;
  phone: string;
}

export interface InvoiceInfo {
  number: string;
  date: string;
}
