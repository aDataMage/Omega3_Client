enum OrderStatus {
    PENDING = 'pending',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    PROCESSING = 'processing',
    REFUNDED = 'refunded',
}

enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    PAYPAL = 'paypal',
    BANK_TRANSFER = 'bank_transfer',
    STRIPE = 'stripe',
    CASH_ON_DELIVERY = 'cash_on_delivery',
}

enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export interface OrderBase {
  customer_id: string;
  store_id: string;
  order_date: string; // ISO date string
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface OrderCreate extends OrderBase {}

export interface Order extends OrderBase {
  order_id: string;
}

export interface OrderUpdate extends Partial<OrderBase> {}
