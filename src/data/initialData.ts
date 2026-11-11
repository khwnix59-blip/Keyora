import { Product, Category, StoreSettings, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-name',
    name: 'Name Keychains',
    image: '/src/assets/images/product_name_bar_1794382967325.jpg',
    description: 'Bespoke solid brass and gold bar keychains customized with your name, date, or coordinates.'
  },
  {
    id: 'cat-couple',
    name: 'Couple Keychains',
    image: '/src/assets/images/product_couple_set_1794382968107.jpg',
    description: 'Complementary two-piece sets designed to interlock with laser-etched sentimental monograms.'
  },
  {
    id: 'cat-gift',
    name: 'Gift Sets',
    image: '/src/assets/images/product_gift_box_1794382969347.jpg',
    description: 'Presented in bespoke matte black rigid cases lined with velvet, ready for unforgettable gifting.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-aurum-bar',
    name: 'Aurum Solid Brass Name Bar',
    price: 1850,
    category: 'Name Keychains',
    description: 'Cast from solid jeweler-grade brass with a brilliant 18K yellow gold ion plating. Hand-polished to a mirror sheen with precision chamfered edges. Includes custom rotary diamond engraving for names up to 12 characters.',
    images: [
      '/src/assets/images/product_name_bar_1794382967325.jpg',
      '/src/assets/images/hero_keychain_showcase_1794382966635.jpg'
    ],
    stock: 24,
    isFeatured: true,
    isPersonalizable: true,
    isActive: true,
    createdAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'prod-couple-interlock',
    name: 'Duo Interlocking Monogram Set',
    price: 2950,
    category: 'Couple Keychains',
    description: 'Two pieces that fit together like a solved mystery. One crafted in polished warm gold, the counterpart in brushed gunmetal slate. Both pieces carry your individual initials alongside a shared anniversary date.',
    images: [
      '/src/assets/images/product_couple_set_1794382968107.jpg',
      '/src/assets/images/hero_keychain_showcase_1794382966635.jpg'
    ],
    stock: 18,
    isFeatured: true,
    isPersonalizable: true,
    isActive: true,
    createdAt: '2026-03-02T12:00:00.000Z'
  },
  {
    id: 'prod-florentine-leather',
    name: 'Florentine Leather & Monogram Plaque',
    price: 2450,
    category: 'Name Keychains',
    description: 'Full-grain Italian calf leather folded and stitched by hand with waxed saddle thread. Fitted with a heavy gold brass badge engraved with your custom initials and equipped with an antique spring snap clasp.',
    images: [
      '/src/assets/images/product_leather_gold_1794382969682.jpg',
      '/src/assets/images/hero_keychain_showcase_1794382966635.jpg'
    ],
    stock: 15,
    isFeatured: true,
    isPersonalizable: true,
    isActive: true,
    createdAt: '2026-03-03T15:30:00.000Z'
  },
  {
    id: 'prod-sovereign-gift-box',
    name: 'The Sovereign Gift Suite',
    price: 3600,
    category: 'Gift Sets',
    description: 'The ultimate luxury token. Includes a personalized medallion keychain with braided calfskin loop, housed inside our signature matte black foil-stamped keepsake box, paired with a wax-sealed calligraphy card.',
    images: [
      '/src/assets/images/product_gift_box_1794382969347.jpg',
      '/src/assets/images/product_leather_gold_1794382969682.jpg'
    ],
    stock: 12,
    isFeatured: true,
    isPersonalizable: true,
    isActive: true,
    createdAt: '2026-03-04T09:15:00.000Z'
  },
  {
    id: 'prod-vintage-skeleton-key',
    name: 'Antique Key Heritage Token',
    price: 2150,
    category: 'Name Keychains',
    description: 'Inspired by 19th-century cabinet master keys, this piece incorporates our signature Keyora vintage silhouette cast in antiqued gold with an engraved barrel and custom initial plaque.',
    images: [
      '/src/assets/images/hero_keychain_showcase_1794382966635.jpg',
      '/src/assets/images/product_name_bar_1794382967325.jpg'
    ],
    stock: 8,
    isFeatured: false,
    isPersonalizable: true,
    isActive: true,
    createdAt: '2026-03-05T14:20:00.000Z'
  },
  {
    id: 'prod-nocturne-couple',
    name: 'Nocturne Yin & Yang Couple Edition',
    price: 3200,
    category: 'Couple Keychains',
    description: 'Sleek geometric architectural tags for partners. Micro-engraved with reciprocal coordinates (where you first met and where you said yes) and finished with heavy jewelry jump rings.',
    images: [
      '/src/assets/images/product_couple_set_1794382968107.jpg',
      '/src/assets/images/product_gift_box_1794382969347.jpg'
    ],
    stock: 0, // intentional Out of stock demo item
    isFeatured: false,
    isPersonalizable: true,
    isActive: true,
    createdAt: '2026-03-06T18:45:00.000Z'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  whatsappNumber: '+923001234567',
  instagram: 'https://instagram.com/keyorastudio',
  deliveryCharges: 250,
  heroText: "More than just a keychain. It's a story.",
  freeDeliveryThreshold: 5000
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'KYR-98421',
    customer: {
      name: 'Hamza Tariq',
      phone: '+92 321 8472910',
      city: 'Lahore',
      address: 'House 42-B, Sector Z, Phase 3, DHA',
      notes: 'Please ensure gift packaging is intact. Delivery before Friday if possible.'
    },
    items: [
      {
        productId: 'prod-aurum-bar',
        name: 'Aurum Solid Brass Name Bar',
        price: 1850,
        qty: 1,
        image: '/src/assets/images/product_name_bar_1794382967325.jpg',
        personalization: 'HAMZA T.'
      },
      {
        productId: 'prod-florentine-leather',
        name: 'Florentine Leather & Monogram Plaque',
        price: 2450,
        qty: 1,
        image: '/src/assets/images/product_leather_gold_1794382969682.jpg',
        personalization: 'H.T. · 2026'
      }
    ],
    subtotal: 4300,
    deliveryCharges: 250,
    total: 4550,
    status: 'Pending',
    paymentMethod: 'Cash on Delivery',
    createdAt: '2026-03-09T11:20:00.000Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'KYR-98422',
    customer: {
      name: 'Ayesha Malik',
      phone: '+92 333 4589201',
      city: 'Islamabad',
      address: 'Apartment 402, Royal Heights, F-11/2',
      notes: 'Please ring bell twice.'
    },
    items: [
      {
        productId: 'prod-sovereign-gift-box',
        name: 'The Sovereign Gift Suite',
        price: 3600,
        qty: 1,
        image: '/src/assets/images/product_gift_box_1794382969347.jpg',
        personalization: 'MALIK & ZARA'
      }
    ],
    subtotal: 3600,
    deliveryCharges: 250,
    total: 3850,
    status: 'Confirmed',
    paymentMethod: 'Cash on Delivery',
    createdAt: '2026-03-08T15:45:00.000Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'KYR-98423',
    customer: {
      name: 'Saad Farooq',
      phone: '+92 301 9283741',
      city: 'Karachi',
      address: 'Bungalow 18/A, Khayaban-e-Mujahid, Phase 5, DHA',
      notes: 'Call before arriving.'
    },
    items: [
      {
        productId: 'prod-couple-interlock',
        name: 'Duo Interlocking Monogram Set',
        price: 2950,
        qty: 1,
        image: '/src/assets/images/product_couple_set_1794382968107.jpg',
        personalization: 'S & M · 14.02'
      }
    ],
    subtotal: 2950,
    deliveryCharges: 250,
    total: 3200,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    createdAt: '2026-03-07T09:10:00.000Z'
  }
];
