export interface OrderItemBase {
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  discount_applied: number;
  total_price: number;
}

export interface OrderItemCreate extends OrderItemBase {}

export interface OrderItem extends OrderItemBase {
  order_item_id: string;
}

export interface OrderItemUpdate extends Partial<OrderItemBase> {}
