export interface KPIs {
    title: 'Total Sales' | 'Total Profit' | 'Total Orders' | 'Total Returns';
    value: number;
    percentage_change: Partial<string>;
    trend_data: {
        date: string;
        value: number;}[];
    previous_total : number;
    current_date_range: string;
    previous_date_range: string;
}