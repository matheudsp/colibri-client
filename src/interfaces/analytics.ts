export interface MonthlyIncomeDto {
  month: string;
  amount: number;
}

export interface RentIncomeResponseDto {
  year: number;
  monthlyIncome: MonthlyIncomeDto[];
}

export interface StatusDto {
  goodPayer: number;
  late: number;
  defaulted: number;
}

export interface TenantsStatusResponseDto {
  totalTenants: number;
  status: StatusDto;
}

export interface PaymentsSummaryResponseDto {
  period: string;
  received: number;
  pending: number;
}

export interface OccupancyTypeDto {
  type: string;
  total: number;
  occupied: number;
}

export interface PropertiesOccupancyResponseDto {
  types: OccupancyTypeDto[];
}
