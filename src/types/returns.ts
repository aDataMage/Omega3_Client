enum ReturnStatus {
    INITIATED = 'initiated',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
}


export interface ReturnBase {
  order_item_id: string;
  return_date: string; // ISO date string
  reason: string;
  refund_amount: number;
  return_status: ReturnStatus;
  created_at: string; // ISO date string
}

export interface ReturnCreate extends ReturnBase {}

export interface Return extends ReturnBase {
  return_id: string;
}

export interface ReturnUpdate extends Partial<ReturnBase> {}