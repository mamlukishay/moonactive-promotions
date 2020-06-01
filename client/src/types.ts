export type Promotion = { _id: string; 'Start Date': string } & Record<string, string>;

export type PromotionTableItem = Promotion & { selected: boolean };

export interface Action {
  type: string;
  payload?: unknown;
}
