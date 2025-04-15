export interface KPIs {
    title: string;
    value: number;
    percentage_change: Partial<number>;
    trend_data: {
        date: string;
        value: number;}[]
}