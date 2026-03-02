export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'in_escrow'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'refunded';

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  item_name: string;
  amount: number;
  status: OrderStatus;
  otp_code?: string;
  otp_expires_at?: string;
  tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: 'mobile_money' | 'bank_transfer' | 'crypto';
  status: 'pending' | 'confirmed' | 'released' | 'refunded';
  tx_hash?: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  raised_by: string;
  reason: string;
  status: 'open' | 'resolved';
  resolution?: string;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  seller_name: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  created_at: string;
}
