import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product, Category, Order, StoreSettings, OrderStatus } from '../types';
import {
  fetchProducts,
  fetchCategories,
  fetchOrders,
  fetchStoreSettings,
  saveProduct,
  deleteProductById,
  saveCategory,
  deleteCategoryById,
  submitOrder,
  updateOrderStatusById,
  deleteOrderById,
  updateStoreSettings
} from '../firebase/service';
import { INITIAL_SETTINGS } from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  loading: boolean;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
  removeToast: (id: string) => void;
  refreshAll: () => Promise<void>;
  createOrUpdateProduct: (product: Omit<Product, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  createOrUpdateCategory: (category: Omit<Category, 'id'> & { id?: string }) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateSettings: (newSettings: StoreSettings) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      const [prods, cats, ords, sets] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchStoreSettings()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setSettings(sets);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const createOrUpdateProduct = async (productData: Omit<Product, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
    const saved = await saveProduct(productData as any);
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    addToast('success', 'Product Saved', `"${saved.name}" has been updated.`);
    return saved;
  };

  const deleteProduct = async (id: string) => {
    await deleteProductById(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Product Removed', 'The item has been deleted from your catalog.');
  };

  const createOrUpdateCategory = async (categoryData: Omit<Category, 'id'> & { id?: string }) => {
    const saved = await saveCategory(categoryData);
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    addToast('success', 'Category Saved', `"${saved.name}" is now available.`);
    return saved;
  };

  const deleteCategory = async (id: string) => {
    await deleteCategoryById(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Category Removed', 'Category removed successfully.');
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const newOrder = await submitOrder(orderData);
    setOrders((prev) => [newOrder, ...prev]);
    // Also deduct stock for ordered items
    setProducts((prev) =>
      prev.map((p) => {
        const matchedItem = orderData.items.find((item) => item.productId === p.id);
        if (matchedItem) {
          const updatedStock = Math.max(0, p.stock - matchedItem.qty);
          saveProduct({ ...p, stock: updatedStock });
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );
    addToast('success', 'Order Confirmed', `Order ${newOrder.orderNumber} received.`);
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await updateOrderStatusById(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    addToast('success', 'Status Updated', `Order status changed to ${status}.`);
  };

  const deleteOrder = async (id: string) => {
    await deleteOrderById(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
    addToast('info', 'Order Removed', 'Order has been deleted.');
  };

  const updateSettings = async (newSettings: StoreSettings) => {
    const saved = await updateStoreSettings(newSettings);
    setSettings(saved);
    addToast('success', 'Settings Saved', 'Store configuration updated live.');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        loading,
        toasts,
        addToast,
        removeToast,
        refreshAll,
        createOrUpdateProduct,
        deleteProduct,
        createOrUpdateCategory,
        deleteCategory,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        updateSettings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
