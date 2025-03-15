
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  alertThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  clientId: string;
  date: Date;
  items: SaleItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Purchase {
  id: string;
  supplierName: string;
  date: Date;
  items: PurchaseItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ClientWithSales = Client & { sales: Sale[] };
export type ProductWithCategory = Product & { category: Category };
