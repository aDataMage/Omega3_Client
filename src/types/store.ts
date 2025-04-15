import { Regoin } from "./customer";

export interface StoreBase {
    store_id: string;
    manager_name: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
    region: Regoin;
}

export interface StoreCreate extends StoreBase {}

export interface Store extends StoreBase {
  store_id: string;
}

export interface StoreUpdate extends Partial<StoreBase> {}