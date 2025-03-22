
export interface MovementEvent {
  date: string;
  type: 'production' | 'shipment';
  quantity: number;
  unitValue: number; // cost for production, price for shipment
  reference: string;
  batchId?: string;
}
