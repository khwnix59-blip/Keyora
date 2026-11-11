import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDoc
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, isFirebaseConfigured } from './config';
import { Product, Category, Order, StoreSettings, OrderStatus } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_SETTINGS
} from '../data/initialData';

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'keyora_products_v1',
  CATEGORIES: 'keyora_categories_v1',
  ORDERS: 'keyora_orders_v1',
  SETTINGS: 'keyora_settings_v1',
  AUTH: 'keyora_mock_auth_user'
};

// Helper for localStorage initial seed
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

// ==================== PRODUCTS ====================
export async function fetchProducts(): Promise<Product[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }));
      }
      // If Firestore is empty, seed it with initial products
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }
      return INITIAL_PRODUCTS;
    } catch (err) {
      console.warn('Firestore fetchProducts fallback to local:', err);
    }
  }
  return getLocalItem<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export async function saveProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  const productId = product.id || `prod-${Date.now()}`;
  const completeProduct: Product = {
    ...product,
    id: productId,
    createdAt: product.createdAt || new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'products', productId), completeProduct);
    } catch (err) {
      console.warn('Firestore saveProduct error, updating local:', err);
    }
  }

  // Update local storage copy
  const existing = getLocalItem<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const index = existing.findIndex((p) => p.id === productId);
  let updated: Product[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = completeProduct;
  } else {
    updated = [completeProduct, ...existing];
  }
  setLocalItem(LOCAL_STORAGE_KEYS.PRODUCTS, updated);
  return completeProduct;
}

export async function deleteProductById(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.warn('Firestore deleteProduct error:', err);
    }
  }

  const existing = getLocalItem<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const updated = existing.filter((p) => p.id !== id);
  setLocalItem(LOCAL_STORAGE_KEYS.PRODUCTS, updated);
}

// ==================== CATEGORIES ====================
export async function fetchCategories(): Promise<Category[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) }));
      }
      for (const c of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', c.id), c);
      }
      return INITIAL_CATEGORIES;
    } catch (err) {
      console.warn('Firestore fetchCategories fallback:', err);
    }
  }
  return getLocalItem<Category[]>(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export async function saveCategory(category: Omit<Category, 'id'> & { id?: string }): Promise<Category> {
  const categoryId = category.id || `cat-${Date.now()}`;
  const completeCategory: Category = {
    ...category,
    id: categoryId
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'categories', categoryId), completeCategory);
    } catch (err) {
      console.warn('Firestore saveCategory error:', err);
    }
  }

  const existing = getLocalItem<Category[]>(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const index = existing.findIndex((c) => c.id === categoryId);
  let updated: Category[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = completeCategory;
  } else {
    updated = [...existing, completeCategory];
  }
  setLocalItem(LOCAL_STORAGE_KEYS.CATEGORIES, updated);
  return completeCategory;
}

export async function deleteCategoryById(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      console.warn('Firestore deleteCategory error:', err);
    }
  }

  const existing = getLocalItem<Category[]>(LOCAL_STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const updated = existing.filter((c) => c.id !== id);
  setLocalItem(LOCAL_STORAGE_KEYS.CATEGORIES, updated);
}

// ==================== ORDERS ====================
export async function fetchOrders(): Promise<Order[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        const orders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return orders;
      }
      for (const o of INITIAL_ORDERS) {
        await setDoc(doc(db, 'orders', o.id), o);
      }
      return INITIAL_ORDERS;
    } catch (err) {
      console.warn('Firestore fetchOrders fallback:', err);
    }
  }
  return getLocalItem<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

export async function submitOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `KYR-${randomSuffix}`;
  const createdAt = new Date().toISOString();
  const id = `ord-${Date.now()}`;

  const completeOrder: Order = {
    ...orderData,
    id,
    orderNumber,
    createdAt
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'orders', id), completeOrder);
    } catch (err) {
      console.warn('Firestore submitOrder error:', err);
    }
  }

  const existing = getLocalItem<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  setLocalItem(LOCAL_STORAGE_KEYS.ORDERS, [completeOrder, ...existing]);
  return completeOrder;
}

export async function updateOrderStatusById(id: string, status: OrderStatus): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (err) {
      console.warn('Firestore updateOrderStatus error:', err);
    }
  }

  const existing = getLocalItem<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const updated = existing.map((o) => (o.id === id ? { ...o, status } : o));
  setLocalItem(LOCAL_STORAGE_KEYS.ORDERS, updated);
}

export async function deleteOrderById(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (err) {
      console.warn('Firestore deleteOrder error:', err);
    }
  }

  const existing = getLocalItem<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const updated = existing.filter((o) => o.id !== id);
  setLocalItem(LOCAL_STORAGE_KEYS.ORDERS, updated);
}

// ==================== SETTINGS ====================
export async function fetchStoreSettings(): Promise<StoreSettings> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists()) {
        return snap.data() as StoreSettings;
      }
      await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    } catch (err) {
      console.warn('Firestore fetchStoreSettings fallback:', err);
    }
  }
  return getLocalItem<StoreSettings>(LOCAL_STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export async function updateStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
    } catch (err) {
      console.warn('Firestore updateStoreSettings error:', err);
    }
  }
  setLocalItem(LOCAL_STORAGE_KEYS.SETTINGS, settings);
  return settings;
}

// ==================== IMAGE UPLOADER ====================
export async function uploadProductImage(file: File): Promise<string> {
  if (isFirebaseConfigured && storage && auth?.currentUser) {
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (err) {
      console.warn('Firebase Storage upload error, converting to data URL fallback:', err);
    }
  }

  // Fallback: Read as base64 data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// ==================== AUTHENTICATION ====================
export interface AdminUser {
  email: string;
  role: 'admin';
}

export async function loginAdminUser(email: string, pass: string): Promise<AdminUser> {
  if (isFirebaseConfigured && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return { email: cred.user.email || email, role: 'admin' };
    } catch (err: any) {
      // If Firebase Auth throws because the user isn't in their Firebase yet,
      // allow fallback if matching standard admin credentials
      if (email.toLowerCase() === 'admin@keyora.studio' && pass === 'admin123') {
        const mockUser: AdminUser = { email, role: 'admin' };
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, JSON.stringify(mockUser));
        return mockUser;
      }
      throw new Error(err.message || 'Authentication failed. Please verify credentials.');
    }
  }

  // Local Admin Authentication check
  if ((email.toLowerCase() === 'admin@keyora.studio' && pass === 'admin123') ||
      (email.includes('@') && pass.length >= 6)) {
    const mockUser: AdminUser = { email, role: 'admin' };
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, JSON.stringify(mockUser));
    return mockUser;
  }

  throw new Error('Invalid email or password. Use admin@keyora.studio / admin123');
}

export async function logoutAdminUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH);
}

export function subscribeToAuthState(callback: (user: AdminUser | null) => void): () => void {
  if (isFirebaseConfigured && auth) {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        callback({ email: firebaseUser.email || '', role: 'admin' });
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH);
        callback(stored ? JSON.parse(stored) : null);
      }
    });
    return unsubscribe;
  }

  // Local storage mode
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH);
  callback(stored ? JSON.parse(stored) : null);
  return () => {};
}
