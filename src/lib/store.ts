
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, Product, Category, Sale, Purchase } from '@/types';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Get current date
const getCurrentDate = () => new Date();

interface AppState {
  clients: Client[];
  products: Product[];
  categories: Category[];
  sales: Sale[];
  purchases: Purchase[];
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Sale actions
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  
  // Purchase actions
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePurchase: (id: string, purchase: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      clients: [],
      products: [],
      categories: [],
      sales: [],
      purchases: [],
      
      // Client actions
      addClient: (client) => set((state) => ({
        clients: [
          ...state.clients,
          {
            ...client,
            id: generateId(),
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate(),
          },
        ],
      })),
      
      updateClient: (id, updatedClient) => set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id
            ? { ...client, ...updatedClient, updatedAt: getCurrentDate() }
            : client
        ),
      })),
      
      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter((client) => client.id !== id),
      })),
      
      // Category actions
      addCategory: (category) => set((state) => ({
        categories: [
          ...state.categories,
          {
            ...category,
            id: generateId(),
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate(),
          },
        ],
      })),
      
      updateCategory: (id, updatedCategory) => set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id
            ? { ...category, ...updatedCategory, updatedAt: getCurrentDate() }
            : category
        ),
      })),
      
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      })),
      
      // Product actions
      addProduct: (product) => set((state) => ({
        products: [
          ...state.products,
          {
            ...product,
            id: generateId(),
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate(),
          },
        ],
      })),
      
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map((product) =>
          product.id === id
            ? { ...product, ...updatedProduct, updatedAt: getCurrentDate() }
            : product
        ),
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      })),
      
      // Sale actions
      addSale: (sale) => set((state) => {
        // Update product stock when sale is added
        const updatedProducts = [...state.products];
        
        sale.items.forEach((item) => {
          const productIndex = updatedProducts.findIndex((p) => p.id === item.productId);
          if (productIndex !== -1) {
            updatedProducts[productIndex] = {
              ...updatedProducts[productIndex],
              stock: updatedProducts[productIndex].stock - item.quantity,
              updatedAt: getCurrentDate(),
            };
          }
        });
        
        return {
          sales: [
            ...state.sales,
            {
              ...sale,
              id: generateId(),
              createdAt: getCurrentDate(),
              updatedAt: getCurrentDate(),
            },
          ],
          products: updatedProducts,
        };
      }),
      
      updateSale: (id, updatedSale) => set((state) => ({
        sales: state.sales.map((sale) =>
          sale.id === id
            ? { ...sale, ...updatedSale, updatedAt: getCurrentDate() }
            : sale
        ),
      })),
      
      deleteSale: (id) => set((state) => ({
        sales: state.sales.filter((sale) => sale.id !== id),
      })),
      
      // Purchase actions
      addPurchase: (purchase) => set((state) => {
        // Update product stock when purchase is added
        const updatedProducts = [...state.products];
        
        purchase.items.forEach((item) => {
          const productIndex = updatedProducts.findIndex((p) => p.id === item.productId);
          if (productIndex !== -1) {
            updatedProducts[productIndex] = {
              ...updatedProducts[productIndex],
              stock: updatedProducts[productIndex].stock + item.quantity,
              updatedAt: getCurrentDate(),
            };
          }
        });
        
        return {
          purchases: [
            ...state.purchases,
            {
              ...purchase,
              id: generateId(),
              createdAt: getCurrentDate(),
              updatedAt: getCurrentDate(),
            },
          ],
          products: updatedProducts,
        };
      }),
      
      updatePurchase: (id, updatedPurchase) => set((state) => ({
        purchases: state.purchases.map((purchase) =>
          purchase.id === id
            ? { ...purchase, ...updatedPurchase, updatedAt: getCurrentDate() }
            : purchase
        ),
      })),
      
      deletePurchase: (id) => set((state) => ({
        purchases: state.purchases.filter((purchase) => purchase.id !== id),
      })),
    }),
    {
      name: 'store-management-app',
      skipHydration: false,
      partialize: (state) => ({
        clients: state.clients,
        products: state.products, 
        categories: state.categories,
        sales: state.sales,
        purchases: state.purchases,
      }),
    }
  )
);
